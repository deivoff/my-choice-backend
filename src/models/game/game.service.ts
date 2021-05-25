import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { PubSubEngine } from 'graphql-subscriptions';
import { decode } from 'jsonwebtoken';

import { ID } from 'src/common/scalars/objectId.scalar';
import { DecodedUser } from 'src/models/user/entities/user.entity';

import { GameSessionService } from './game-session/game-session.service';
import { GameStatus } from './game-session/game-session.entity';
import { ShareResourcesInput } from './dto/share-resources.input';
import { Card } from './card/entities/card.entity';

import { Game } from './game.entity';
import getTimeout from 'src/timeout';
import { FieldType } from 'src/models/game/field/field.dictionaries';
import { CardDroppedPayload, PlayerChoicePayload, UpdateActiveGamePayload } from 'src/models/game/game.utils';

const DISCONNECT_TIMEOUT_MS = 10_000;

const CHOICE_TIMEOUT_MS = 40_000;
const MOVE_TIMEOUT_MS = 40_000;
const DREAM_TIMEOUT_MS = 40_000;

type CreateGame = {
  name: string;
  creator: Types.ObjectId,
  observerMode?: boolean,
  tournament?: Types.ObjectId
}

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game) private readonly gameModel: ReturnModelType<typeof Game>,
    @Inject('PUB_SUB') private readonly  pubSub: PubSubEngine,
    private readonly gameSessionService: GameSessionService,
) {}

  async connect(token?: string) {
    if (!token) return;

    getTimeout('connection')(token).clear();
    const data = decode(token) as DecodedUser;
    if (!data?._id) return;

    const gameId = await this.gameSessionService.connect(
      Types.ObjectId(data?.['_id'])
    );

    if (gameId) {
      await this.publishActiveGame(gameId);
      return
    }
  }

  async disconnect(token?: string) {
    if (!token) return;

    getTimeout('connection')(token).set(async () => {
      const data = decode(token) as DecodedUser;
      if (!data?._id) return;
      const gameId = await this.gameSessionService.disconnect(
        Types.ObjectId(data?.['_id'])
      );

      if (!gameId) return;

      if (typeof gameId === 'boolean') {
        await this.publishActiveGames();
        return;
      }

      await this.publishActiveGame(gameId)
    }, DISCONNECT_TIMEOUT_MS);
  }

  async createGameSession(createGameInput: CreateGame) {
    const gameId = Types.ObjectId();
    const creatorId = createGameInput.creator;
    const playersOrObservers = createGameInput.observerMode ? {
        observers: [creatorId],
        players: []
      } : {
        observers: [],
        players: [creatorId]
      };

    const game = await this.gameSessionService.create({
      _id: gameId,
      name: createGameInput.name,
      tournament: createGameInput.tournament,
      creator: createGameInput.creator,
      ...playersOrObservers
    });

    await this.publishActiveGames();

    return game;
  }

  async deleteGameSession(gameID: ID) {
    await this.gameSessionService.hashService.delete(gameID);

    await this.publishActiveGames();
    return true;
  }

  getActiveGames() {
    return this.gameSessionService.hashService.findAll();
  }

  getActiveGame(gameId: ID) {
    return this.gameSessionService.hashService.findOne(gameId)
  }

  private async publishActiveGames() {
    const activeGames = await this.getActiveGames();
    await this.pubSub.publish('updateActiveGames', {
      updateActiveGames: activeGames
    });
  }

  private async publishActiveGame(gameId: ID) {
    const activeGame = await this.getActiveGame(gameId);

    if (!activeGame) {
      return;
    }

    const moveTimer = getTimeout('move')(gameId);
    if (moveTimer.get()) {
      if (!activeGame?.mover) {
        moveTimer.clear()
      }
    } else {
      if (activeGame?.mover) {
        moveTimer.set(async () => {
          await this.gameSessionService.playerMove(activeGame.mover!);
          this.publishActiveGame(gameId);
        }, MOVE_TIMEOUT_MS)
      }
    }

    if (activeGame?.winner) {
      await this.gameModel.findByIdAndUpdate(gameId, {
        $set: {
          winner: activeGame.winner
        }
      })
    }
    await this.pubSub.publish<UpdateActiveGamePayload>('updateActiveGame', {
      game: activeGame,
      gameId: activeGame._id,
    })
  }

  private async publishChoiceInGame(gameId: ID, cardId: ID, choiceId?: ID) {
    await this.pubSub.publish<PlayerChoicePayload>('playerChoice', {
      choiceId,
      gameId,
      cardId,
    })
  }

  private async publishDroppedCard(gameId: ID, userId: Types.ObjectId, card: Card) {
    getTimeout('choice')(gameId).set(
      async () => {
        if (card.type === FieldType.Incident) {
          await this.gameSessionService.choice(userId, card._id);
        } else {
          await this.gameSessionService.choice(userId);
        }
        await this.publishChoiceInGame(gameId, card._id);
        this.publishActiveGame(gameId);
      }, CHOICE_TIMEOUT_MS
    );

    await this.pubSub.publish<CardDroppedPayload>('cardDropped', {
      cardDropped: card,
      gameId,
      userId,
    })
  }

  async join(gameId: Types.ObjectId, userId: Types.ObjectId) {
    const game = await this.gameSessionService.join(gameId, userId);

    this.publishActiveGames();
    this.publishActiveGame(gameId);
    return game;
  }

  async leave(userId: Types.ObjectId, gameId: Types.ObjectId) {
    const game = await this.gameSessionService.leave(userId, gameId);

    if (!game || game.status === GameStatus.Awaiting) {
      this.publishActiveGames();
    }

    if (game) {
      this.publishActiveGame(game._id);
    }
  }

  async start(gameId: Types.ObjectId, userId: ID) {
    const game = await this.gameSessionService.start(gameId, userId);

    await this.gameModel.create({
      _id: game._id,
      name: game.name,
      creator: game.creator,
      tournament: game.tournament,
      players: game.players,
    });

    getTimeout('dream')(gameId).set(async () => {
      await this.gameSessionService.randomDream(gameId);
      this.publishActiveGame(gameId);
    }, DREAM_TIMEOUT_MS);

    this.publishActiveGames();
    this.publishActiveGame(gameId);
    return game;
  }

  async choiceDream(dream: number, userId: Types.ObjectId) {
    const game = await this.gameSessionService.choiceDream(dream, userId);

    if (game.mover || game.status === GameStatus.InProgress) {
      getTimeout('dream')(game._id).clear();
    }

    this.publishActiveGame(game._id);
  }

  async choice(userId: Types.ObjectId, cardId: ID, choiceId?: ID) {
    const { gameId, card } = await this.gameSessionService.choice(userId, cardId, choiceId);
    getTimeout('choice')(gameId).clear();
    await this.publishChoiceInGame(gameId, cardId, choiceId);

    await this.publishActiveGame(gameId);
    if (card) {
      this.publishDroppedCard(gameId, userId, card)
    }
  }


  async updateAfterOpportunity(userId: Types.ObjectId, opportunityId: ID, diceResult?: number) {
    const { gameId, card } = await this.gameSessionService.updateAfterOpportunity(userId, diceResult);

    await Promise.all([
      this.publishChoiceInGame(gameId, opportunityId),
      this.publishActiveGame(gameId),
    ]);

    if (card) {
      this.publishDroppedCard(gameId, userId, card);
    }
  }

  async playerMove(moveCount: number, userId: Types.ObjectId) {
    const result = await this.gameSessionService.playerMove(
      userId,
      moveCount,
      (gameId) => {
        getTimeout('move')(gameId).clear();
        this.publishActiveGame(gameId);
      }
    );

    await this.publishActiveGame(result.gameId);
    if (result.card) {
      this.publishDroppedCard(result.gameId, userId, result.card);
      this.publishActiveGame(result.gameId);
    }
  }

  async shareResources(shareResourcesInput: ShareResourcesInput, userId: ID) {
    const gameId = await this.gameSessionService.shareResources(
      userId,
      shareResourcesInput,
    );

    if (gameId) {
      await this.publishActiveGame(gameId);
    }
  }

  findAllUserGames(userId: Types.ObjectId) {
    return this.gameModel.find({ players: { $in: [userId] } });
  }

  async findLimitGames(limit: number = 10, offset: number = 0, tournamentId?: Types.ObjectId) {
    const data = await this.gameModel.aggregate([
      {
        $match: {
          'tournament': tournamentId ? tournamentId : { $exists: false },
        },
      },
      {
        $sort: { '_id' : -1 }
      },
      {
        $facet: {
          stage1: [{ $group: { _id: null, count: { $sum:1 } } }],
          stage2: [{ $skip: offset }, { $limit: limit } ]
        },
      },
      {
        $unwind: "$stage1"
      },
      {
        $project: {
          totalCount: "$stage1.count",
          games: "$stage2",
        }
      }
    ])

    return data[0];
  }

  findOne(id: Types.ObjectId) {
    return `This action returns a #${id} game`;
  }

}
