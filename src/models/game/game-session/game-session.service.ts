import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { union, filter, isNil } from 'lodash';
import { GameSession, GameStatus } from 'src/models/game/game-session/game-session.entity';
import { PlayerService } from 'src/models/game/player/player.service';
import { CYCLED_ERROR, GAME_NOT_FOUND, YOU_IN_GAME } from 'src/models/game/game.errors';
import { Types } from 'mongoose';
import { Player, PlayerPosition } from 'src/models/game/player/player.entity';
import { PLAYER_NOT_FOUND } from 'src/models/game/player/player.errors';
import { FieldService } from 'src/models/game/field/field.service';
import { Card } from 'src/models/game/card/entities/card.entity';
import { CardService } from 'src/models/game/card/card.service';
import { ShareResourcesInput } from 'src/models/game/dto/share-resources.input';
import { ID } from 'src/common/scalars/objectId.scalar';
import getTimeout from 'src/models/game/game-session/game-session.utils';
import { getRandomDream } from 'src/models/game/field/field.dictionaries';
import { createHashServiceFromHashModel, HashModel } from 'src/type-redis/utils/hash.model';

interface CreateGameSession {
  name: string;
  _id: Types.ObjectId;
  creator: any;
  tournament?: Types.ObjectId;
  players: Types.ObjectId[];
  observers: Types.ObjectId[];
}

type PlayerActionResult = {
  gameId: Types.ObjectId
  card?: Card
}

@Injectable()
export class GameSessionService {
  public hashService: HashModel<typeof GameSession>;

  constructor(
    @Inject('PUBLISHER') redisClient: Redis,
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly fieldService: FieldService,
    private readonly cardService: CardService,
  ) {
    this.hashService = createHashServiceFromHashModel(
      GameSession,
      redisClient,
    )
  }

  create = async ({
    _id,
    name,
    creator,
    players,
    observers,
    tournament,
  }: CreateGameSession) => {
    const player = await this.playerService.hashService.findOne(creator);

    if (player) {
      await this.playerInGame(player);
    }

    const game = await this.hashService.create(_id, {
      _id,
      name,
      creator,
      players,
      observers,
      tournament,
      status: GameStatus.Awaiting,
    });

    if (players?.length) {
      await Promise.all(players.map((id) => this.playerService.initPlayer(id, _id)));
    }

    return game;
  };

  remove = async (gameId: Types.ObjectId) => {
    getTimeout('choice')(gameId).clear();
    getTimeout('move')(gameId).clear();
    getTimeout('dream')(gameId).clear();
    await Promise.all([
      this.hashService.findOneAndUpdate(gameId, {
        status: GameStatus.Finished,
      }),
      this.cardService.clearDeck(gameId),
    ]);
  };

  private playerInGame = async (player: Player) => {
    const anotherGame = await this.hashService.findOne(player.gameId);

    if (anotherGame) {
      throw new Error(YOU_IN_GAME(anotherGame.name))
    } else {
      await this.playerService.hashService.delete(player._id)
    }
  };

  join = async (gameId: Types.ObjectId, userId: Types.ObjectId): Promise<GameSession> => {
    const player = await this.playerService.hashService.findOne(userId);

    if (player?.gameId && !player.gameId.equals(gameId)) {
      await this.playerInGame(player);
    }

    const game = await this.hashService.findOne(gameId);

    if (!game) {
      throw new Error(GAME_NOT_FOUND)
    }

    const { players, observers } = game;
    const gameHasThisPlayer = players?.some((player) => player.equals(userId));
    const gameHasThisObserver = observers?.some((observer) => observer.equals(userId));

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
      case game.status === GameStatus.Awaiting && ((game?.players?.length || 0) < 8): {
        await this.playerService.initPlayer(userId, gameId);
        await this.hashService.findOneAndUpdate(gameId, {
          players: union(game.players, [userId])
        });
        break;
      }
      default: {
        await this.hashService.findOneAndUpdate(gameId, {
          observers: union(game.observers, [userId]),
        })
      }
    }

    const updatedGame = await this.hashService.findOne(gameId);

    if (!updatedGame) throw new Error(GAME_NOT_FOUND);
    return updatedGame;
  };

  leave = async (userId: Types.ObjectId, gameId: Types.ObjectId): Promise<GameSession | undefined> => {
    const player = await this.playerService.hashService.findOne(userId);
    const game = await this.hashService.findOne(gameId);

    if (player?.gameId?.equals(gameId)) {
      if (game?.mover && player._id.equals(game.mover)) {
        getTimeout('move')(gameId).clear();
        await this.setNewMover(player);
      }

      await this.playerService.hashService.delete(userId);
    }
    let updatedGame: GameSession | undefined;

    if (!game) return undefined;

    if (!player) {
      // observer !== creator
      if (!game.creator.equals(userId)) {
        updatedGame = await this.hashService.findOneAndUpdate(gameId, {
          observers: filter(game.observers, observer => !observer.equals(userId)),
        });
      }
    } else {
      updatedGame = await this.hashService.findOneAndUpdate(gameId, {
        players: filter(game.players, player => !player.equals(userId)),
      });
    }

    if (updatedGame) {
      if (!updatedGame?.players?.length && !updatedGame?.observers?.length) {
        await this.remove(updatedGame._id);
        return undefined;
      }
    }


    return updatedGame;
  };

  start = async (gameId: ID, userId: ID): Promise<GameSession> => {
    const game = await this.hashService.findOneAndUpdate(gameId, {
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

  randomDream = async (gameId: Types.ObjectId): Promise<GameSession> => {
    const game = await this.hashService.findOne(gameId);

    if (!game) throw new Error(GAME_NOT_FOUND);

    const players = await this.getPlayers(gameId, game?.players || []);

    const playersWithoutDream = players.filter(player => !player?.dream);

    for (let i = 0; i < (playersWithoutDream.length ?? 0); i++) {
      const player = playersWithoutDream[i]!;
      const randomDream = getRandomDream();
      await this.playerService.findOneAndUpdate(player._id, {
        dream: randomDream,
      })
    }

    const { mover, winner, error } = await this.playerService.getNextMover(players);

    if (error) throw new Error(CYCLED_ERROR);

    const updatedGame = await this.hashService.findOneAndUpdate(game._id, {
      status: GameStatus.InProgress,
      mover,
      winner
    });
    return updatedGame!
  };

  choiceDream = async (dream: number, userId: Types.ObjectId): Promise<GameSession> => {
    const player = await this.playerService.hashService.findOneAndUpdate(userId, {
      dream: dream
    });
    const game = await this.hashService.findOne(player?.gameId!);

    if (!game) throw new Error(GAME_NOT_FOUND);

    const players = await this.getPlayers(game._id, game?.players || []);
    const allDreamsExist = players.every(player => player?.dream);

    if (allDreamsExist) {
      const { mover, winner, error } = await this.playerService.getNextMover(players);
      if (error) throw new Error(CYCLED_ERROR);
      const updatedGame = await this.hashService.findOneAndUpdate(game._id, {
        status: GameStatus.InProgress,
        mover,
        winner
      });
      return updatedGame!;
    }

    return game;
  };

  choice = async (userId: Types.ObjectId, cardId?: ID, choiceId?: ID): Promise<PlayerActionResult> => {
    if (!cardId) {
      const player = await this.playerService.hashService.findOne(userId);
      if (!player) {
        throw new Error(PLAYER_NOT_FOUND);
      }
      await this.setNewMover(player);

      return {
        gameId: player?.gameId!,
      }

    }

    const isFieldChanged = await this.playerService.updateAfterChoice(cardId, userId, choiceId);
    const updatedPlayer = await this.playerService.hashService.findOne(userId);

    if (!updatedPlayer) {
      throw new Error(PLAYER_NOT_FOUND);
    }

    if (updatedPlayer?.winner) {
      await this.hashService.findOneAndUpdate(updatedPlayer.gameId!, {
        winner: userId,
        status: GameStatus.Finished,
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
    const game = await this.hashService.findOne(currentMover?.gameId!);
    const players = await this.getPlayers(game?._id!, game?.players!);
    const { mover, winner, error } = await this.playerService.getNextMover(players, currentMover!);
    if (error) throw new Error(CYCLED_ERROR);

    await this.hashService.findOneAndUpdate(game?._id!, {
      status: winner ? GameStatus.Finished : GameStatus.InProgress,
      mover,
      winner
    });
  };

  updateAfterOpportunity = async (
    playerId: Types.ObjectId,
    diceResult?: number
  ): Promise<PlayerActionResult> => {
    const isFieldChanged = await this.playerService.updateAfterOpportunity(playerId, diceResult);
    const player = await this.playerService.hashService.findOne(playerId);
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

  playerMove = async (
    playerId: Types.ObjectId,
    moveCount?: number,
    onMove?: (gameId: ID
    ) => Promise<void> | void): Promise<PlayerActionResult> => {
    if (isNil(moveCount)) {
      const player = await this.playerService.hashService.findOne(playerId);
      if (!player) throw new Error(PLAYER_NOT_FOUND);

      await this.setNewMover(player);
      return {
        gameId: player.gameId!
      }
    }

    const player = await this.playerService.changePlayerPosition(playerId, moveCount);

    if (!player) throw new Error(PLAYER_NOT_FOUND);
    await this.hashService.findOneAndUpdate(player.gameId!, {
      mover: undefined
    });

    await onMove?.(player.gameId!);

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
        this.hashService.findOneAndUpdate(player?.gameId!, {
          status: GameStatus.Finished,
          winner: player._id,
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
    const player = await this.playerService.hashService.findOne(playerId);

    if (!player) throw new Error(PLAYER_NOT_FOUND);
    await this.playerService.share(player, shareResourcesInput);

    return player.gameId;
  };

  getPlayers = async (
    gameId: Types.ObjectId,
    playersIds: Types.ObjectId[],
    ) => {
    const players = await this.playerService.hashService.findSome(playersIds);
    const filteredPlayers = players.filter(Boolean) as Player[];

    if (filteredPlayers.length !== playersIds.length) {
      await this.hashService.findOneAndUpdate(gameId, {
        players: filteredPlayers.map(player => player._id)
      })
    }

    return filteredPlayers;
  };

  getObserversCount = (observers: ID[]): number => {
    return observers?.length || 0;
  };

  connect = async (userId: Types.ObjectId): Promise<Types.ObjectId | void> => {
    const player = await this.playerService.findOneAndUpdate(userId, { disconnected: false });

    if (player?.gameId) {
      return player.gameId;
    }
  };

  disconnect = async (userId: Types.ObjectId): Promise<Types.ObjectId | true | void>  => {
    const player = await this.playerService.findOneAndUpdate(userId, { disconnected: true });

    if (!player?.gameId) return;

    const game = await this.hashService.findOne(player.gameId);

    if (!game) return;
    const players = await this.getPlayers(game._id, game.players!);
    if (!game.observers?.length && players.every(player => isNil(player?.disconnected) ? true : player.disconnected)) {
      await this.remove(player.gameId);
      return true;
    }

    if (game.mover?.equals(userId) && game.status !== GameStatus.Finished) {
      getTimeout('move')(game._id).clear();
      const { mover, winner, error } = await this.playerService.getNextMover(players, player);
      if (error) throw new Error(CYCLED_ERROR);
      await this.hashService.findOneAndUpdate(game._id, {
        mover,
        winner,
        status: winner ? GameStatus.Finished : game.status,
      })
    }

    return player.gameId;
  };
}
