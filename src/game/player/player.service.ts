import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { UserService } from 'src/user/user.service';
import { Player, PlayerStatus } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';
import { fromPlayerToRedis, fromRedisToPlayer } from 'src/game/player/player.redis-adapter';
import { isEmpty } from 'lodash';

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
      status: PlayerStatus.Awaiting,
      gameId
    };

    await this.redisClient.hset(playerId, fromPlayerToRedis(player));
    return await this.redisClient.hgetall(playerId).then(fromRedisToPlayer);
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
