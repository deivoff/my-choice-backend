import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { UserService } from 'src/user/user.service';
import { Player, PlayerPosition } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';
import { fromPlayerToRedis, fromRedisToPlayer } from 'src/game/player/player.redis-adapter';
import { isEmpty } from 'lodash';
import { Types } from 'mongoose';
import { FIELDS_COUNT, FROM_INNER_TO_OUTER } from 'src/game/field/field.dictionaries';
import { PLAYER_NOT_FOUND } from 'src/game/player/player.errors';
import { USER_NOT_FOUND } from 'src/user/user.errors';


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

  getNextMover = async (players: Player[], currentPlayer: Player = players[0]): Promise<GameState> => {
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

    const currentPlayerIndex = players.findIndex(({ _id }) => currentPlayer._id.equals(_id));
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
        await this.findOneAndUpdate(playerId, {
          position: PlayerPosition.Inner,
          cell: moveCount - 1
        });

        break;
      }
      case newPosition === PlayerPosition.Outer: {
        const newCell = FROM_INNER_TO_OUTER[player.cell!];

        await this.findOneAndUpdate(playerId, {
          position: PlayerPosition.Outer,
          cell: newCell
        });

        break;
      }
      default: {
        const newCell = ((player?.cell ?? 0) + moveCount) % FIELDS_COUNT[player?.position!];

        await this.findOneAndUpdate(playerId, {
          cell: newCell
        })
      }
    }

    return player;
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
