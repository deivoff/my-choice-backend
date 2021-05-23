import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { isNil } from 'lodash';
import { UserService } from 'src/models/user/user.service';
import { Player, PlayerPosition } from 'src/models/game/player/player.entity';
import { Types } from 'mongoose';
import {
  DREAM_FIELDS,
  FIELDS_COUNT,
  FieldType,
  FROM_INNER_TO_OUTER,
  INNER_FIELD_DICT,
  INNER_FIELDS,
} from 'src/models/game/field/field.dictionaries';
import { PLAYER_NOT_FOUND } from 'src/models/game/player/player.errors';
import { USER_NOT_FOUND } from 'src/models/user/user.errors';
import { CardService } from 'src/models/game/card/card.service';
import { Action, ChoiceCard, CHOICES_CARD, Incident } from 'src/models/game/card/entities/card.entity';
import { NEED_CHOICE } from 'src/models/game/card/card.errors';
import { Resources, ResourceType } from 'src/models/game/resources/resources.entity';
import { opportunitySuccess } from 'src/models/game/card/entities/opportunity.utils';
import { ShareResourcesInput } from 'src/models/game/dto/share-resources.input';
import { ID } from 'src/common/scalars/objectId.scalar';
import { createHashServiceFromHashModel, HashModel } from 'src/type-redis/utils/hash.model';


type GameState = {
  mover?: Types.ObjectId;
  winner?: Types.ObjectId;
  error?: string;
}

@Injectable()
export class PlayerService {
  public hashService: HashModel<typeof Player>;

  constructor(
    @Inject('PUBLISHER') redisClient: Redis,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly cardService: CardService,
  ) {
    this.hashService = createHashServiceFromHashModel(
      Player,
      redisClient,
    )
  }

  initPlayer = async (userId: Types.ObjectId, gameId: Types.ObjectId) => {
    const user = await this.userService.findOne(userId);

    if (!user) throw new Error(USER_NOT_FOUND);

    const player = {
      _id: userId,
      nickname: user.nickname,
      avatar: user.avatar || '',
      sex: user.sex,
      gameover: false,
      winner: false,
      gameId,
    };

    return this.hashService.create(userId, player);
  };

  private updatePlayerAndGetMover = async (
    activePlayers: Player[],
    currentPlayerIndex: number = 0,
    deep: number = activePlayers.length * 3
  ): Promise<Types.ObjectId | null> => {
    if (!deep) return null;

    const moverIndex = currentPlayerIndex % activePlayers.length;
    const mover = await this.hashService.findOne(activePlayers[moverIndex]._id);

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
      const winner = player.winner ? player._id : undefined;
      return {
        mover: player._id,
        winner,
      }
    }

    const activePlayers = players.filter(player => !(player.gameover || player.disconnected));

    if (activePlayers.length === 1) {
      const [winner] = activePlayers;
      await this.findOneAndUpdate(winner._id, {
        winner: true,
      });
      return {
        winner: winner._id
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
      mover: moverId
    }
  };

  changePlayerPosition = async (playerId: Types.ObjectId, moveCount: number, newPosition?: PlayerPosition) => {
    const player = await this.hashService.findOne(playerId);
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

  updateAfterChoice = async (cardId: ID, playerId: Types.ObjectId, choiceId?: ID): Promise<boolean> => {
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

    return false;
  };

  updateAfterOpportunity = async (playerId: Types.ObjectId, diceResult?: number): Promise<boolean> => {
    let isFieldChanged = false;
    const player = await this.hashService.findOne(playerId);
    if (!player) throw new Error(PLAYER_NOT_FOUND);
    const { white = 0, lives = 0, money = 0, dark = 0 } = player.resources || {};

    if (diceResult) {
      switch (true) {
        case (lives! + diceResult) >= 10 && white! >= 10:
        case (lives! + diceResult) >= 15 && money! >= 100: {
          isFieldChanged = true;
          await this.setPlayerResources(playerId, {
            lives: diceResult
          });
          break;
        }
        case lives! >= 10 && (white! + diceResult) >= 10: {
          isFieldChanged = true;
          await this.setPlayerResources(playerId, {
            white: diceResult
          });
          break
        }
      }
    }

    if (!dark && opportunitySuccess({ white, lives, money})) {
      isFieldChanged = true
    }

    if (isFieldChanged) {
      await this.changePlayerPosition(playerId, 0, PlayerPosition.Outer);
    }

    return isFieldChanged;
  };

  setPlayerAction = async (playerId: Types.ObjectId, action: Action) => {
    const player = await this.hashService.findOne(playerId);

    if (!player) throw new Error(PLAYER_NOT_FOUND);

    let lessCheck = true;
    let moreCheck = true;
    let isFieldChange = false;

    if (action.less) {
      Object.entries(action.less).forEach(([key, value]) => {
        if (isNil(value)) return;
        lessCheck = (player.resources?.[key] ?? 0) < value
      })
    }

    if (action.more) {
      Object.entries(action.more).forEach(([key, value]) => {
        if (isNil(value)) return;
        moreCheck = (player.resources?.[key] ?? 0) >= value;
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

  setInnerFieldPosition = async (playerId: Types.ObjectId, field: FieldType) => {
    const player = await this.hashService.findOne(playerId);
    if (!player) throw new Error(PLAYER_NOT_FOUND);

    const nextField = INNER_FIELD_DICT[field]
      .find(elem => player?.cell! < elem) || INNER_FIELD_DICT[field][0];


    await this.findOneAndUpdate(playerId, {
      cell: nextField
    });
  };

  share = async (player: Player, { exchange, for: shareFor }: ShareResourcesInput) => {
    const resources = player.resources!;
    if (exchange === ResourceType.dark) {
      resources.dark = resources!.dark! - 1;

      if (shareFor === ResourceType.money) {
        resources.money = resources!.money! - 50;
      }

      if (shareFor === ResourceType.white) {
        resources.white = resources!.white! - 5;
      }

      if (shareFor === ResourceType.lives) {
        resources.lives = resources!.lives! - 5;
      }

    }

    if (exchange === ResourceType.lives) {
      resources.lives = resources!.lives! + 1;
      resources.money = resources!.money! - 10;
    }

    return this.findOneAndUpdate(player._id, {
      resources
    })
  };

  setPlayerResources = async (playerId: Types.ObjectId, resources: Resources = {}) => {
    const player = await this.hashService.findOne(playerId);
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

  setPlayerWin = async (playerId: Types.ObjectId) => {
    return await this.hashService.findOneAndUpdate(playerId, {
      winner: true
    })
  };

  findOneAndUpdate = async (id: Types.ObjectId, updatedFields: Partial<Player>): Promise<undefined | Player> => {
    return this.hashService.findOneAndUpdate(id, updatedFields, (existed, update) => ({
      ...existed,
      ...update,
      resources: !existed.resources ? update.resources : update.resources ? {
        ...existed.resources,
        ...update.resources
      } : existed.resources,
    }));
  };

}
