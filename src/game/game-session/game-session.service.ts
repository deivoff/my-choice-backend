import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { union, isEmpty } from 'lodash';
import { GameStatus } from 'src/game/game-session/game-session.entity';
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
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
  ) {}

  private key = (_id: string = '') => {
    return `game:${_id}`
  };

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

    if (players?.length) {
      await Promise.all(players.map(this.playerService.initPlayer))
    }

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

  async join(gameId: string, userId: string) {
    const gameKey = this.key(gameId);
    const game = await this.redisClient.hgetall(gameKey);

    if (!game || isEmpty(game)) {
      throw new Error('Game not found!')
    }

    if (game.status === GameStatus.Awaiting) {
      await this.playerService.initPlayer(userId);
      await this.redisClient.hset(gameKey, {
        players: union(game.players.split(','), userId).join(',')
      })
    } else {
      await this.redisClient.hset(gameKey, {
        observers: union(game.observers.split(','), userId).join(',')
      })
    }

    return this.redisClient.hgetall(gameKey);
  }

  async leave(gameId: string, userId: string) {
    const gameKey = this.key(gameId);
    const game = await this.redisClient.hgetall(gameKey);

    if (!game || isEmpty(game)) {
      throw new Error('Game not found!')
    }

    if (game.status === GameStatus.Awaiting) {
      await this.redisClient.hset(gameKey, {
        players: [...game.players.split(',').filter(id => id !== userId)].join(',')
      })
    } else {
      await this.redisClient.hset(gameKey, {
        observers: [...game.observers.split(',').filter(id => id !== userId)].join(',')
      })
    }

    const updatedGame = await this.redisClient.hgetall(gameKey);
    if (!updatedGame.players && !updatedGame.observers) {
      await this.redisClient.del(gameKey);
      return null;
    }

    return updatedGame;
  }

  async getPlayers(players: string) {
    const playersIds = players.split(',');

    return this.playerService.findSome(playersIds);
  }

  async getObserversCount(observers: string) {
    return observers.split(',').length
  }
}
