import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { isEmpty, union, without } from 'lodash';
import { GameSession, GameStatus } from 'src/game/game-session/game-session.entity';
import { PlayerService } from 'src/game/player/player.service';
import { GAME_NOT_FOUND } from 'src/game/game.errors';
import { ID, objectIdToString } from 'src/utils';
import { fromGameSessionToRedis, fromRedisToGameSession } from 'src/game/game-session/game-session.redis-adapter';
import { Types } from 'mongoose';
import { CardService } from 'src/game/card/card.service';

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
    private readonly cardService: CardService,
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

  remove = async (gameId: ID) => {
    const gameKey = objectIdToString(gameId);

    await this.redisClient.del(this.key(gameKey));
  };

  findOne = async (id: ID) => {
    const res = await this.redisClient.hgetall(this.key(objectIdToString(id)));
    return isEmpty(res) ? null : fromRedisToGameSession(res);
  };

  findOneAndUpdate = async (id: ID, updatedFields: Partial<GameSession>) => {
    const gameKey = this.key(objectIdToString(id));

    const game = await this.findOne(id);

    if (!game || isEmpty(game)) {
      throw new Error(GAME_NOT_FOUND)
    }

    const updatedGame: GameSession = {
      ...game,
      ...updatedFields,
    };

    await this.redisClient.hset(gameKey, fromGameSessionToRedis(updatedGame));
    return updatedGame;
  };

  findAll = async () => {
    const [,keys] = await this.redisClient.scan(0, 'match', this.key('*'));
    return await Promise.all(keys.sort().reverse().map(
      id => this.redisClient.hgetall(id).then(fromRedisToGameSession)
    ));
  };

  getAllAwaiting = async () => {
    const games = await this.findAll();
    return games.filter(({ status }) => status === GameStatus.Awaiting)
  };

  join = async (gameId: ID, userId: ID): Promise<GameSession> => {
    const game = await this.findOne(gameId);

    if (!game) {
      throw new Error(GAME_NOT_FOUND)
    }

    const { players, observers } = game;
    const gameHasThisPlayer = players.some((player) => player === objectIdToString(userId));
    const gameHasThisObserver = observers.some((observer) => observer === objectIdToString(userId));

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
        await this.findOneAndUpdate(gameId, {
          players: union(game.players, [objectIdToString(userId)])
        });
        break;
      }
      default: {
        await this.findOneAndUpdate(gameId, {
          observers: union(game.observers, [objectIdToString(userId)]),
        })
      }
    }

    return await this.findOne(gameId);
  };

  leave = async (userId: ID): Promise<GameSession | null> => {
    const player = await this.playerService.findOne(userId);

    if (!player.gameId) return null;
    const game = await this.findOne(player.gameId);
    if (!game) return null;
    const { _id: gameId } = game;
    const { players, observers } = game;
    const gameHasThisPlayer = players.some((player) => player === objectIdToString(userId));
    const gameHasThisObserver = observers.some((observer) => observer === objectIdToString(userId));

    switch (true) {
      case gameHasThisPlayer: {
        await Promise.all([
          this.findOneAndUpdate(gameId, {
            players: without(game.players, objectIdToString(userId)),
          }),
          this.playerService.remove(userId)]
        );
        break;
      }
      case gameHasThisObserver: {
        await this.findOneAndUpdate(gameId, {
          observers: without(game.observers, objectIdToString(userId)),
        })
      }
    }

    const updatedGame = await this.findOne(gameId);

    if (!updatedGame.players?.length && !updatedGame.observers?.length) {
      await this.remove(gameId);
      return null;
    }

    return updatedGame;
  };

  start = async (gameId: ID, userId: ID): Promise<GameSession> => {
    return await this.findOneAndUpdate(gameId, {
      status: GameStatus.ChoiceDream,
    });
  };

  choiceDream = async (dream: number, userId: ID): Promise<GameSession> => {
    const player = await this.playerService.findOneAndUpdate(userId, {
      dream: dream
    });
    const game = await this.findOne(player.gameId);
    const players = await this.getPlayers(game.players);
    const allDreamsExist = players.every(player => player.dream);

    if (allDreamsExist) {
      const { mover, winner, error } = await this.playerService.getNextMover(players);
      return await this.findOneAndUpdate(game._id, {
        status: GameStatus.InProgress,
        mover,
        winner
      })
    }

    return game;
  };

  getPlayers = (players: ID[]) => {
    return this.playerService.findSome(players);
  };

  getObserversCount = (observers: ID[]): number => {
    return observers?.length || 0;
  };

  connect = async (userId: ID): Promise<Types.ObjectId | void> => {
    const player = await this.playerService.findOneAndUpdate(userId, { disconnected: false });

    if (player?.gameId) {
      return player.gameId;
    }
  };

  disconnect = async (userId: ID): Promise<Types.ObjectId | true | void>  => {
    const player = await this.playerService.findOneAndUpdate(userId, { disconnected: true });

    if (!player?.gameId) return;

    const game = await this.findOne(player.gameId);

    if (!game) return;
    const players = await this.getPlayers(game.players);
    if (!game.observers?.length && players.every(player => player.disconnected)) {
      await this.remove(player.gameId);
      return true;
    }

    return player.gameId;
  };
}