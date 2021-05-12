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

const DISCONNECT_TIMEOUT_MS = 3000;
const disconnectTimeouts = new Map<string, NodeJS.Timeout>();

type CreateGame = {
  name: string;
  creator: string,
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

    const data = decode(token) as DecodedUser;
    if (!data?._id) return;
    // const timeout = disconnectTimeouts.get(data._id);
    // if (timeout) {
    //   clearTimeout(timeout);
    //   disconnectTimeouts.delete(data._id);
    //   return;
    // }

    const gameId = await this.gameSessionService.connect(data?.['_id']);

    if (gameId) {
      await this.publishActiveGame(gameId);
      return
    }
  }

  async disconnect(token?: string) {
    if (!token) return;

    const data = decode(token) as DecodedUser;
    if (!data?._id) return;
    const gameId = await this.gameSessionService.disconnect(data._id);

    if (!gameId) return;

    if (typeof gameId === 'boolean') {
      await this.publishActiveGames();
      return;
    }

    disconnectTimeouts.delete(data._id);
    await this.publishActiveGame(gameId)

    // const timeout = setTimeout(async () => {
    //   const gameId = await this.gameSessionService.disconnect(data._id);
    //
    //   if (!gameId) return;
    //
    //   if (typeof gameId === 'boolean') {
    //     await this.publishActiveGames();
    //     return;
    //   }
    //
    //   disconnectTimeouts.delete(data._id);
    //   await this.publishActiveGame(gameId);
    // }, DISCONNECT_TIMEOUT_MS);
    //
    // disconnectTimeouts.set(data._id, timeout);
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
      _id: gameId.toHexString(),
      name: createGameInput.name,
      tournament: createGameInput.tournament,
      creator: createGameInput.creator,
      ...playersOrObservers
    });

    await this.publishActiveGames();

    return game;
  }

  async deleteGameSession(gameID: ID) {
    await this.gameSessionService.delete(gameID);

    await this.publishActiveGames();
    return true;
  }

  getActiveGames() {
    return this.gameSessionService.findAll();
  }

  getActiveGame(gameId: ID) {
    return this.gameSessionService.findOne(gameId)
  }

  private async publishActiveGames() {
    const activeGames = await this.getActiveGames();
    await this.pubSub.publish('updateActiveGames', {
      updateActiveGames: activeGames
    });
  }

  private async publishActiveGame(gameId: ID) {
    const activeGame = await this.getActiveGame(gameId);
    if (activeGame?.winner) {
      await this.gameModel.findByIdAndUpdate(gameId, {
        $set: {
          winner: Types.ObjectId(activeGame.winner)
        }
      })
    }
    await this.pubSub.publish('updateActiveGame', {
      updateActiveGame: activeGame
    })
  }

  private async publishChoiceInGame(gameId: ID, cardId: ID, choiceId?: ID) {
    await this.pubSub.publish('playerChoice', {
      choiceId,
      gameId,
      cardId,
    })
  }

  private async publishDroppedCard(gameId: ID, userId: ID, card: Card) {
    await this.pubSub.publish('cardDropped', {
      cardDropped: card,
      gameId,
      userId,
    })
  }

  async join(gameId: ID, userId: ID) {
    const game = await this.gameSessionService.join(gameId, userId);

    this.publishActiveGames();
    this.publishActiveGame(gameId);
    return game;
  }

  async leave(userId: ID, gameId: ID) {
    const game = await this.gameSessionService.leave(userId, gameId);

    if (!game || game.status === GameStatus.Awaiting) {
      this.publishActiveGames();
    }

    if (game) {
      this.publishActiveGame(game._id);
    }
  }

  async start(gameId: ID, userId: ID) {
    const game = await this.gameSessionService.start(gameId, userId);

    await this.gameModel.create({
      _id: game._id,
      name: game.name,
      creator: game.creator,
      tournament: game.tournament,
      players: game.players?.map(Types.ObjectId),
    });
    this.publishActiveGames();
    this.publishActiveGame(gameId);
    return game;
  }

  async choiceDream(dream: number, userId: ID) {
    const game = await this.gameSessionService.choiceDream(dream, userId);

    this.publishActiveGame(game._id);
  }

  async choice(cardId: ID, userId: ID, choiceId?: ID) {
    const { gameId, card } = await this.gameSessionService.choice(cardId, userId, choiceId);

    await this.publishChoiceInGame(gameId, cardId, choiceId);

    await this.publishActiveGame(gameId);
    if (card) {
      this.publishDroppedCard(gameId, userId, card)
    }
  }


  async updateAfterOpportunity(userId: ID, opportunityId: ID, diceResult?: number) {
    const { gameId, card } = await this.gameSessionService.updateAfterOpportunity(userId, diceResult);

    await Promise.all([
      this.publishChoiceInGame(gameId, opportunityId),
      this.publishActiveGame(gameId),
    ]);

    if (card) {
      this.publishDroppedCard(gameId, userId, card);
    }
  }

  async playerMove(moveCount: number, userId: ID) {
    const result = await this.gameSessionService.playerMove(
      moveCount,
      userId,
      (gameId) => this.publishActiveGame(gameId)
    );

    await this.publishActiveGame(result.gameId);
    if (result.card) {
      this.publishDroppedCard(result.gameId, userId, result.card)
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

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: Types.ObjectId) {
    return `This action returns a #${id} game`;
  }

}
