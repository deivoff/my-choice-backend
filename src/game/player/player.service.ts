import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { UserService } from 'src/user/user.service';
import { Player } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';
import { fromPlayerToRedis, fromRedisToPlayer } from 'src/game/player/player.redis-adapter';
import { isEmpty } from 'lodash';
import { Types } from 'mongoose';


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
    const player = {
      _id: userId,
      nickname: user.nickname,
      avatar: user.avatar,
      gameover: false,
      winner: false,
      gameId,
    };

    await this.redisClient.hset(playerId, fromPlayerToRedis(player));
    return await this.redisClient.hgetall(playerId).then(fromRedisToPlayer);
  };

  private updatePlayersAndGetMover = async (
    activePlayers: Player[],
    currentPlayerIndex: number = 0,
    deep: number = activePlayers.length * 3
  ): Promise<Types.ObjectId | null> => {
    if (!deep) return null;

    const moverIndex = currentPlayerIndex % activePlayers.length;
    const mover = await this.findOne(activePlayers[moverIndex]._id);

    if (!mover.hold) return mover._id;

    await this.findOneAndUpdate(mover._id, {
      hold: mover.hold - 1
    });

    return await this.updatePlayersAndGetMover(activePlayers, moverIndex + 1, deep - 1);
  };

  getNextMover = async (players: Player[], currentPlayer: Player = players[0]): Promise<GameState> => {
    if (players.length === 1) {
      const [player] = players;
      const playerId = player._id.toHexString();
      return {
        mover: playerId,
        winner: player.winner ? playerId : null
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
    const moverId = await this.updatePlayersAndGetMover(activePlayers, currentPlayerIndex + 1)

    if (!moverId) {
      return {
        error: 'Cycled in game move!'
      }
    }

    return {
      mover: moverId.toHexString()
    }
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
    return Promise.all(ids.map(this.findOne))
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
      } : null,
    };

    await this.redisClient.hset(playerId, fromPlayerToRedis(updatedPlayer));
    return updatedPlayer;
  };

}
