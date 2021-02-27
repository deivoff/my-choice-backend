import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { PlayerStatus } from 'src/game/player/player.entity';

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

  initPlayer = async (id: string | Types.ObjectId) => {
    const playerId = typeof id === 'string' ? id : id.toHexString();
    const user = await this.userService.findOne(playerId);
    const player = {
      _id: playerId,
      nickname: user.nickname,
      status: PlayerStatus.Awaiting
    };

    await this.redisClient.hset(this.key(playerId), player);

    return await this.redisClient.hgetall(this.key(playerId));
  };

  removePlayer = async (id: string | Types.ObjectId) => {
    const playerId = typeof id === 'string' ? id : id.toHexString();

    await this.redisClient.del(this.key(playerId));
  };

  findOne = (id: string | Types.ObjectId) => {
    const playerId = typeof id === 'string' ? this.key(id) : this.key(id.toHexString());
    return this.redisClient.hgetall(playerId);
  };

  findSome = (ids: (string | Types.ObjectId)[]) => {
    return Promise.all(ids.map((id) => this.findOne(id)))
  }

}
