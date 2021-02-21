import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';


@Injectable()
export class PlayerService {
  constructor(
    @Inject('PUBLISHER') private readonly  redisClient: Redis,
  ) {}

  private key(_id: string = '') {
    return `player:${_id}`
  }

  findOne(id: string | Types.ObjectId) {
    const playerId = typeof id === 'string' ? this.key(id) : this.key(id.toHexString());

    return this.redisClient.hgetall(playerId);
  }

  findSome(ids: (string | Types.ObjectId)[]) {
    return Promise.all(ids.map(this.findOne))
  }

}
