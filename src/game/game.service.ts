import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { Game } from 'src/game/game.entity';
import { PubSubEngine } from 'graphql-subscriptions';
import { GameSessionService } from 'src/game/game-session/game-session.service';
import { ID } from 'src/utils';
import { decode } from 'jsonwebtoken';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game) private readonly gameModel: ReturnModelType<typeof Game>,
    @Inject('PUB_SUB') private readonly  pubSub: PubSubEngine,
    private readonly gameSessionService: GameSessionService,
) {}

  async connect(token?: string) {
    if (!token) return;

    const data = decode(token);
    const gameId = await this.gameSessionService.connect(data['_id']);
  }

  async disconnect(token?: string) {
    if (!token) return;

    const data = decode(token);
    const gameId = await this.gameSessionService.disconnect(data['_id']);

    if (!gameId) return;

    if (typeof gameId === 'boolean') {
      await this.publishActiveGames();
      return;
    }


    await this.publishActiveGame(gameId);
  }

  async create(createGameInput: { name: string; creator: string, observerMode?: boolean }) {
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
      creator: createGameInput.creator,
      ...playersOrObservers
    });

    await this.publishActiveGames();

    await this.gameModel.create({
      _id: gameId,
      name: createGameInput.name,
      creator: createGameInput.creator,
    });

    return game;
  }

  getActiveGames() {
    return this.gameSessionService.getAllAwaiting();
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
    await this.pubSub.publish('updateActiveGame', {
      updateActiveGame: activeGame
    })
  }

  async join(gameId: ID, userId: ID) {
    const game = await this.gameSessionService.join(gameId, userId);

    this.publishActiveGames();
    this.publishActiveGame(gameId);
    return game;
  }

  async leave(userId: ID) {
    const game = await this.gameSessionService.leave(userId);

    this.publishActiveGames();

    if (game) {
      this.publishActiveGame(game._id);
    }
  }

  async start(gameId: ID, userId: ID) {
    const game = await this.gameSessionService.start(gameId, userId);

    this.publishActiveGames();
    this.publishActiveGame(gameId);
    return game;
  }

  async choiceDream(dream: number, userId: ID) {
    const game = await this.gameSessionService.choiceDream(dream, userId);

    this.publishActiveGame(game._id);
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: Types.ObjectId) {
    return `This action returns a #${id} game`;
  }

}
