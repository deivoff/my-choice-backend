import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { UserService } from 'src/user/user.service';
import { Player, PlayerPosition } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';
import { fromPlayerToRedis, fromRedisToPlayer } from 'src/game/player/player.redis-adapter';
import { isEmpty } from 'lodash';
import { Types } from 'mongoose';
import {
  DREAM_FIELDS,
  FIELDS_COUNT,
  FieldType,
  FROM_INNER_TO_OUTER,
  INNER_FIELD_DICT,
  INNER_FIELDS,
} from 'src/game/field/field.dictionaries';
import { PLAYER_NOT_FOUND } from 'src/game/player/player.errors';
import { USER_NOT_FOUND } from 'src/user/user.errors';
import { CardService } from 'src/game/card/card.service';
import { Action, ChoiceCard, CHOICES_CARD, Incident } from 'src/game/card/entities/card.entity';
import { NEED_CHOICE } from 'src/game/card/card.errors';
import { Resources } from 'src/game/resources/resources.entity';


type GameState = {
  mover?: string;
  winner?: string;
  error?: any;
}

@Injectable()
export class PlayerService {
  constructor(
    @Inject('PUBLISHER') private readonly redisClient: Redis,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly cardService: CardService,
  ) {}

  private key = (_id: string = '') => {
    return `player:${_id}`
  };

  initPlayer = async (userId: ID, gameId: ID) => {
    const playerId = this.key(objectIdToString(userId));
    const user = await this.userService.findOne(userId);

    if (!user) throw new Error(USER_NOT_FOUND);

    const player = {
      _id: userId,
      nickname: user.nickname,
      avatar: user.avatar || '',
      gameover: false,
      winner: false,
      gameId,
    };

    await this.redisClient.hset(playerId, fromPlayerToRedis(player));
    return await this.redisClient.hgetall(playerId).then(fromRedisToPlayer);
  };

  private updatePlayerAndGetMover = async (
    activePlayers: Player[],
    currentPlayerIndex: number = 0,
    deep: number = activePlayers.length * 3
  ): Promise<Types.ObjectId | null> => {
    if (!deep) return null;

    const moverIndex = currentPlayerIndex % activePlayers.length;
    const mover = await this.findOne(activePlayers[moverIndex]._id);

    if (!mover) throw new Error(PLAYER_NOT_FOUND);

    if (!mover.hold) return mover._id!;

    await this.findOneAndUpdate(mover._id, {
      hold: mover.hold - 1
    });

    return await this.updatePlayerAndGetMover(activePlayers, moverIndex + 1, deep - 1);
  };

  getNextMover = async (players: Player[], currentPlayer?: Player): Promise<GameState> => {
    if (players.length === 1) {
      const [player] = players;
      const playerId = player._id.toHexString();
      return {
        mover: playerId,
        winner: player.winner ? playerId : undefined
      }
    }

    const activePlayers = players.filter(player => !(player.gameover || player.disconnected));

    if (activePlayers.length === 1) {
      const [winner] = activePlayers;
      await this.findOneAndUpdate(winner._id, {
        winner: true,
      });
      const winnerId = winner._id.toHexString();
      return {
        winner: winnerId
      }
    }


    const currentPlayerIndex = players.findIndex(({ _id }) => currentPlayer?._id.equals(_id));

    const moverId = await this.updatePlayerAndGetMover(activePlayers, currentPlayerIndex + 1);
    if (!moverId) {
      return {
        error: 'Cycled in game move!'
      }
    }

    return {
      mover: moverId.toHexString()
    }
  };

  changePlayerPosition = async (playerId: ID, moveCount: number, newPosition?: PlayerPosition) => {
    const player = await this.findOne(playerId);
    if (!player) throw new Error(PLAYER_NOT_FOUND);

    switch (true) {
      case player?.position === PlayerPosition.Start: {
        return await this.findOneAndUpdate(playerId, {
          position: PlayerPosition.Inner,
          cell: moveCount - 1
        });

      }
      case newPosition === PlayerPosition.Outer: {
        const newCell = FROM_INNER_TO_OUTER[player.cell!];

        return await this.findOneAndUpdate(playerId, {
          position: PlayerPosition.Outer,
          cell: newCell
        });

      }
      default: {
        const newCell = ((player?.cell ?? 0) + moveCount) % FIELDS_COUNT[player?.position!];

        return await this.findOneAndUpdate(playerId, {
          cell: newCell
        })
      }
    }
  };

  updateAfterChoice = async (cardId: ID, playerId: ID, choiceId?: ID) => {
    const card = await this.cardService.findOne(cardId);
    const isChoiceCard = CHOICES_CARD.some(type => type === card?.type);
    if (!choiceId && isChoiceCard) {
      throw new Error(NEED_CHOICE);
    }

    switch (true) {
      case card?.type === FieldType.Incident: {
        return await this.setPlayerAction(playerId, (card as unknown as Incident)?.action)
      }
      case isChoiceCard: {
        const { choices } = card as unknown as ChoiceCard;
        const { resources } = choices.find(choice => choice._id.equals(choiceId!)) || {};
        const updatedPlayer = await this.setPlayerResources(playerId, resources);
        const { cell, resources: playerResources, dream } = updatedPlayer!;
        if (
          card?.type === FieldType.Dream
          && cell === dream
          && playerResources!.white! >= DREAM_FIELDS[cell!]
        ) {
          await this.setPlayerWin(playerId);
        }
      }
    }
  };

  setPlayerAction = async (playerId: ID, action: Action) => {
    const player = await this.findOne(playerId);

    if (!player) throw new Error(PLAYER_NOT_FOUND);

    let lessCheck = true;
    let moreCheck = true;
    let isFieldChange = false;

    if (action.less) {
      Object.entries(action.less).forEach(([key, value]) => {
        lessCheck = player.resources?.[key] ?? 0 < value ?? 0
      })
    }

    if (action.more) {
      Object.entries(action.more).forEach(([key, value]) => {
        moreCheck = player.resources?.[key] ?? 0 >= value
      })
    }

    if (lessCheck && moreCheck) {
      if (action.result.resources) {
        await this.setPlayerResources(playerId, action.result.resources);
      }

      if (action.result.hold) {
        await this.findOneAndUpdate(playerId, {
          hold: action.result.hold
        });
      }

      if (action.result.move) {
        await this.setInnerFieldPosition(playerId, action.result.move);

        isFieldChange = true
      }

      if (action.result.gameover) {
        await this.findOneAndUpdate(playerId, {
          gameover: true
        });
      }
    }

    return isFieldChange;
  };

  setInnerFieldPosition = async (playerId: ID, field: FieldType) => {
    const player = await this.findOne(playerId);
    if (!player) throw new Error(PLAYER_NOT_FOUND);

    const nextField = INNER_FIELD_DICT[field]
      .find(elem => player?.cell! < elem) || INNER_FIELDS[field][0];


    await this.findOneAndUpdate(playerId, {
      cell: nextField
    });
  };

  setPlayerResources = async (playerId: ID, resources: Resources = {}) => {
    const player = await this.findOne(playerId);
    if (!player) throw new Error(PLAYER_NOT_FOUND);

    const { resources: playerResources = {} } = player;
    const {
      white,
      lives,
      money,
      dark,
    } = resources!;
    let gameover = false;
    const newResources = Object
      .entries({
        white,
        lives,
        money,
        dark
      })
      .reduce<Resources>((acc, [key, value]) => {
        if (value === 0) {
          return {
            ...acc,
            [key]: 0
          }
        } else {
          const newValue = (acc?.[key] ?? 0) + (value ?? 0);
          return {
            ...acc,
            [key]: newValue >= 0 ? newValue : key === 'money' ? newValue : 0
          }
        }
    }, playerResources!);

    if (newResources?.lives! <= 0) {
      gameover = true
    }

    return await this.findOneAndUpdate(playerId, {
      resources: newResources,
      gameover,
    })
  };

  setPlayerWin = async (playerId: ID) => {
    return await this.findOneAndUpdate(playerId, {
      winner: true
    })
  };

  remove = async (userId: ID) => {
    const playerId = objectIdToString(userId);

    await this.redisClient.del(this.key(playerId));
  };

  findOne = async (id: ID): Promise<null | Player> => {
    const playerId = this.key(objectIdToString(id));
    const res = await this.redisClient.hgetall(playerId);
    return isEmpty(res) ? null : fromRedisToPlayer(res);
  };

  findSome = (ids: ID[]) => {
    return Promise.all(ids.map(this.findOne)) as unknown as Player[]
  };

  findOneAndUpdate = async (id: ID, updatedFields: Partial<Player>): Promise<null | Player> => {
    const playerId = this.key(objectIdToString(id));
    const player = await this.findOne(id);

    if (!player) return null;

    const updatedPlayer: Player = {
      ...player,
      ...updatedFields,
      resources: !player.resources ? updatedFields.resources : updatedFields.resources ? {
        ...player.resources,
        ...updatedFields.resources
      } : player.resources,
    };

    await this.redisClient.hset(playerId, fromPlayerToRedis(updatedPlayer));
    return updatedPlayer;
  };

}
