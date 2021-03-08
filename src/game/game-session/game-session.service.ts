import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { union, isEmpty, without } from 'lodash';
import { GameStatus } from 'src/game/game-session/game-session.entity';
import { PlayerService } from 'src/game/player/player.service';
import { GAME_NOT_FOUND } from 'src/game/game.errors';
import { ID, objectIdToString } from 'src/utils';
import { fromRedisToGameSession } from 'src/game/game-session/game-session.redis-adapter';

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

  create = async ({
    _id,
    name,
    creator,
    players,
    observers,
         }: CreateGameSession) => {
    await this.redisClient.hset(this.key(_id), {
      _id,
      name,
      creator,
      players,
      observers,
      status: GameStatus.Awaiting,
    });

    if (players?.length) {
      await Promise.all(players.map((id) => this.playerService.initPlayer(id, _id)));
    }

    return await this.redisClient.hgetall(this.key(_id));
  };

  getGame = (id: ID) => {
    return this.redisClient.hgetall(this.key(objectIdToString(id))).then(fromRedisToGameSession)
  };

  getAll = async () => {
    const [,keys] = await this.redisClient.scan(0, 'match', this.key('*'));
    return await Promise.all(keys.sort().reverse().map(
      id => this.redisClient.hgetall(id).then(fromRedisToGameSession)
    ));
  };

  getAllAwaiting = async () => {
    const games = await this.getAll();
    return games.filter(({ status }) => status === GameStatus.Awaiting)
  };

  join = async (gameId: ID, userId: ID) => {
    const gameKey = this.key(objectIdToString(gameId));
    const game = await this.getGame(gameId);

    if (!game || isEmpty(game)) {
      throw new Error(GAME_NOT_FOUND)
    }

    const { players, observers } = game;
    const gameHasThisPlayer = players.some((player) => player === userId);
    const gameHasThisObserver = observers.some((observer) => observer === userId);

    switch (true) {
      case gameHasThisObserver:
      case gameHasThisPlayer: {
        await this.playerService.findOneAndUpdate(userId, {
          disconnected: false,
        });
        break;
      }
      case game.status === GameStatus.Awaiting: {
        await this.playerService.initPlayer(userId, gameId);
        await this.redisClient.hset(gameKey, {
          players: union(players, [userId]).join()
        });
        break;
      }
      default: {
        await this.redisClient.hset(gameKey, {
          observers: union(observers, [userId]).join()
        })
      }
    }

    return this.redisClient.hgetall(gameKey);
  };

  leave = async (gameId: ID, userId: ID) => {
    const gameKey = this.key(objectIdToString(gameId));
    const game = await this.getGame(gameId);

    if (!game || isEmpty(game)) {
      throw new Error(GAME_NOT_FOUND)
    }

    if (game.status === GameStatus.Awaiting) {
      await this.redisClient.hset(gameKey, {
        players: without(game.players, objectIdToString(userId))
      })
    } else {
      await this.redisClient.hset(gameKey, {
        observers: without(game.observers, objectIdToString(userId))
      })
    }

    const updatedGame = await this.redisClient.hgetall(gameKey);
    if (!updatedGame.players && !updatedGame.observers) {
      await this.redisClient.del(gameKey);
      return null;
    }

    return updatedGame;
  };

  getPlayers = (players: ID[]) => {
    return this.playerService.findSome(players);
  };

  getObserversCount = (observers: ID[]) => {
    return observers.length || 0;
  }
}
