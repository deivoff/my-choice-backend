import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Player, PlayerStatus } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';
import { Resources } from 'src/game/resources/resources.entity';

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
    const playerId = objectIdToString(userId);
    const user = await this.userService.findOne(playerId);
    const player = {
      _id: playerId,
      nickname: user.nickname,
      avatar: user.avatar,
      status: PlayerStatus.Awaiting,
      gameId: objectIdToString(gameId)
    };

    await this.redisClient.hset(this.key(playerId), player);
    return await this.redisClient.hgetall(this.key(playerId));
  };

  remove = async (userId: ID) => {
    const playerId = objectIdToString(userId);

    await this.redisClient.del(this.key(playerId));
  };

  findOne = (id: ID) => {
    const playerId = this.key(objectIdToString(id));
    return this.redisClient.hgetall(playerId) as unknown as Player;
  };

  findSome = (ids: ID[]) => {
    return Promise.all(ids.map(this.findOne))
  };

  /**
   * @param {string} resources
   * @description parse resources string (white,dark,money,lives).
   */
  getResources = (resources: string = ''): Resources => {
    const [white, dark, money, lives] = resources.split(',');

    if (!white || !dark || !money || !lives) return null;

    return {
      white: Number(white),
      dark: Number(dark),
      money: Number(money),
      lives: Number(lives)
    }
  };

  findOneAndUpdate = async (id: ID, updatedFields: Partial<Player>) => {
    const playerId = this.key(objectIdToString(id));
    const player = await this.redisClient.hgetall(playerId) as unknown as Player;
    await this.redisClient.hset(playerId, {
      ...player,
      ...updatedFields,
    } as {});

    return this.findOne(playerId);
  };

}
