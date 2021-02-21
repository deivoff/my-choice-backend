import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { GameSession, GameStatus } from 'src/game/game-session/game-session.entity';
import { PlayerService } from 'src/game/player/player.service';

interface CreateGameSession {
  name: string;
  _id: string;
  creator: any;
  players: string[];
  observers: string[];
}


@Injectable()
export class GameSessionService {
  constructor(
    @Inject('PUBLISHER') private readonly  redisClient: Redis,
    private readonly playerService: PlayerService,

  ) {}

  private key(_id: string = '') {
    return `game:${_id}`
  }

  async create({
    _id,
    name,
    creator,
    players,
    observers,
         }: CreateGameSession) {
    await this.redisClient.hset(this.key(_id), {
      _id,
      name,
      creator,
      players,
      observers,
      status: GameStatus.Awaiting,
    });

    return await this.redisClient.hgetall(this.key(_id));
  }

  async getAll() {
    const [,keys] = await this.redisClient.scan(0, 'match', this.key('*'));
    return Promise.all(keys.map((key => this.redisClient.hgetall(key))));
  }

  async getAllAwaiting() {
    const games = await this.getAll();
    return games.filter(({ status }) => status === GameStatus.Awaiting)
  }

  async getPlayers(players: string) {
    const playersIds = players.split(',');

    return this.playerService.findSome(playersIds);
  }

  async getObserversCount(observers: string) {
    return observers.split('').length
  }
}
