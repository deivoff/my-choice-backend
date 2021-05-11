import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { isEmpty, union, without } from 'lodash';
import { GameSession, GameStatus } from 'src/models/game/game-session/game-session.entity';
import { PlayerService } from 'src/models/game/player/player.service';
import { CYCLED_ERROR, GAME_NOT_FOUND } from 'src/models/game/game.errors';
import { fromGameSessionToRedis, fromRedisToGameSession } from 'src/models/game/game-session/game-session.redis-adapter';
import { Types } from 'mongoose';
import { Player, PlayerPosition } from 'src/models/game/player/player.entity';
import { PLAYER_NOT_FOUND, PLAYERS_NOT_FOUND } from 'src/models/game/player/player.errors';
import { FieldService } from 'src/models/game/field/field.service';
import { Card } from 'src/models/game/card/entities/card.entity';
import { CardService } from 'src/models/game/card/card.service';
import { ShareResourcesInput } from 'src/models/game/dto/share-resources.input';
import { ID, objectIdToString } from 'src/common/scalars/objectId.scalar';

interface CreateGameSession {
  name: string;
  _id: string;
  creator: any;
  tournament?: ID;
  players: string[];
  observers: string[];
}

type PlayerActionResult = {
  gameId: Types.ObjectId
  card?: Card
}

@Injectable()
export class GameSessionService {
  constructor(
    @Inject('PUBLISHER') private readonly  redisClient: Redis,
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly fieldService: FieldService,
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
    tournament,
         }: CreateGameSession) => {
    await this.redisClient.hset(this.key(_id), {
      _id,
      name,
      creator,
      players,
      observers,
      tournament: tournament ? objectIdToString(tournament) : '',
      status: GameStatus.Awaiting,
    });

    if (players?.length) {
      await Promise.all(players.map((id) => this.playerService.initPlayer(id, _id)));
    }

    return await this.redisClient.hgetall(this.key(_id));
  };

  remove = async (gameId: ID) => {
    const gameKey = objectIdToString(gameId);
    await Promise.all([
      this.redisClient.del(this.key(gameKey)),
      this.cardService.clearDeck(gameId),
    ]);
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
    const gameHasThisPlayer = players?.some((player) => player === objectIdToString(userId));
    const gameHasThisObserver = observers?.some((observer) => observer === objectIdToString(userId));

    switch (true) {
      case gameHasThisObserver: {
        break;
      }
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

    const updatedGame = await this.findOne(gameId);
    if (!updatedGame) throw new Error(GAME_NOT_FOUND);
    return updatedGame;
  };

  leave = async (userId: ID, gameId: ID): Promise<GameSession | null> => {
    const player = await this.playerService.findOne(userId);
    let updatedGame: GameSession | null = null;
    const game = await this.findOne(gameId);
    if (!game) return null;

    if (!player) {
      updatedGame = await this.findOneAndUpdate(gameId, {
        observers: without(game.observers, objectIdToString(userId)),
      });
    } else {
      [updatedGame] = await Promise.all([
        this.findOneAndUpdate(gameId, {
          players: without(game.players, objectIdToString(userId)),
        }),
        this.playerService.remove(userId)]
      );
    }

    if (!updatedGame?.players?.length) {
      await this.remove(gameId);
      return null;
    }

    return updatedGame;
  };

  start = async (gameId: ID, userId: ID): Promise<GameSession> => {
    const game = await this.findOneAndUpdate(gameId, {
      status: GameStatus.ChoiceDream,
    });

    if (!game) throw new Error(GAME_NOT_FOUND);
    for (let i = 0; i < (game?.players?.length ?? 0); i++) {
      const playerId = game.players?.[i]!;
      await this.playerService.findOneAndUpdate(playerId, {
        position: PlayerPosition.Start,
        resources: {
          white: 0,
          dark: 0,
          money: 0,
          lives: 10,
        }
      })
    }

    return game;
  };

  choiceDream = async (dream: number, userId: ID): Promise<GameSession> => {
    const player = await this.playerService.findOneAndUpdate(userId, {
      dream: dream
    });
    const game = await this.findOne(player?.gameId!);

    if (!game) throw new Error(GAME_NOT_FOUND);

    const players = await this.getPlayers(game?.players!);
    const allDreamsExist = players.every(player => player?.dream);

    if (allDreamsExist) {
      const { mover, winner, error } = await this.playerService.getNextMover(players);
      if (error) throw new Error(CYCLED_ERROR);
      return await this.findOneAndUpdate(game._id, {
        status: GameStatus.InProgress,
        mover,
        winner
      })
    }

    return game;
  };

  choice = async (cardId: ID, userId: ID, choiceId?: ID): Promise<PlayerActionResult> => {
    const isFieldChanged = await this.playerService.updateAfterChoice(cardId, userId, choiceId);
    const updatedPlayer = await this.playerService.findOne(userId);

    if (!updatedPlayer) {
      throw new Error(PLAYER_NOT_FOUND);
    }

    if (updatedPlayer?.winner) {
      await this.findOneAndUpdate(updatedPlayer.gameId!, {
        winner: objectIdToString(userId)
      })
    }

    if (isFieldChanged) {
      return await this.playerStoodOnField(updatedPlayer!);
    } else {
      await this.setNewMover(updatedPlayer);

      return {
        gameId: updatedPlayer?.gameId!,
      }
    }
  };

  setNewMover = async (currentMover: Player) => {
    const game = await this.findOne(currentMover?.gameId!);
    const players = await this.getPlayers(game?.players!);
    const { mover, winner, error } = await this.playerService.getNextMover(players, currentMover!);
    if (error) throw new Error(CYCLED_ERROR);

    await this.findOneAndUpdate(game?._id!, {
      status: GameStatus.InProgress,
      mover,
      winner
    });
  };

  updateAfterOpportunity = async (
    playerId: ID,
    diceResult?: number
  ): Promise<PlayerActionResult> => {
    const isFieldChanged = await this.playerService.updateAfterOpportunity(playerId, diceResult);
    const player = await this.playerService.findOne(playerId);
    if (!player) throw new Error(PLAYER_NOT_FOUND);

    if (isFieldChanged) {
      return await this.playerStoodOnField(player);
    } else {
      await this.setNewMover(player);
    }

    return {
      gameId: player.gameId!
    }
  };

  playerMove = async (moveCount: number, playerId: ID, onMove?: (gameId: ID) => Promise<void>): Promise<PlayerActionResult> => {
    const player = await this.playerService.changePlayerPosition(playerId, moveCount);

    if (!player) throw new Error(PLAYER_NOT_FOUND);
    await this.findOneAndUpdate(player.gameId!, {
      mover: undefined
    });

    if (onMove) {
      await onMove(player.gameId!);
    }

    return await this.playerStoodOnField(player);
  };

  private playerStoodOnField = async (player: Player): Promise<PlayerActionResult> => {
    const {
      white,
      winner,
      card,
    } = await this.fieldService.stoodOnField(player);

    if (winner) {
      await Promise.all([
        this.findOneAndUpdate(player?.gameId!, {
          winner: objectIdToString(player._id),
        }),
        this.playerService.findOneAndUpdate(player._id, {
          winner: true
        }),
      ]);

      return {
        gameId: player.gameId!
      };
    }

    if (white) {
      const updatedPlayer = await this.playerService.findOneAndUpdate(player._id, {
        resources: {
          white: player.resources?.white! + white
        }
      });
      await this.setNewMover(updatedPlayer!);

      return {
        gameId: player.gameId!
      };
    }

    return {
      gameId: player.gameId!,
      card: card!
    };
  };

  shareResources = async ( playerId: ID, shareResourcesInput: ShareResourcesInput) => {
    const player = await this.playerService.findOne(playerId);

    if (!player) throw new Error(PLAYER_NOT_FOUND);
    await this.playerService.share(player, shareResourcesInput);

    return player.gameId;
  };

  getPlayers = (players: ID[]) => {
    if (!players) {
      throw new Error(PLAYERS_NOT_FOUND);
    }
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
    const players = await this.getPlayers(game.players!);
    if (!game.observers?.length && players.every(player => player.disconnected)) {
      await this.remove(player.gameId);
      return true;
    }

    if (game.mover === objectIdToString(userId) && game.status !== GameStatus.Finished) {
      const { mover, winner, error } = await this.playerService.getNextMover(players, player);
      if (error) throw new Error(CYCLED_ERROR);
      await this.findOneAndUpdate(game._id, {
        mover,
        winner
      })
    }

    return player.gameId;
  };
}