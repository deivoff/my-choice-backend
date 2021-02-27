import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { UpdateGameInput } from './dto/update-game.input';
import { Game } from 'src/game/game.entity';
import { PubSubEngine } from 'graphql-subscriptions';
import { GameSessionService } from 'src/game/game-session/game-session.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game) private readonly gameModel: ReturnModelType<typeof Game>,
    @Inject('PUB_SUB') private readonly  pubSub: PubSubEngine,
    private readonly gameSessionService: GameSessionService,
) {}

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

  private async publishActiveGames() {
    const activeGames = await this.getActiveGames();
    await this.pubSub.publish('updateActiveGames', {
      updateActiveGames: activeGames
    });
  }

  async join(gameId: Types.ObjectId, userId: Types.ObjectId) {
    const game = await this.gameSessionService.join(gameId.toHexString(), userId.toHexString());

    this.publishActiveGames();
    return game
  }

  async leave(gameId: Types.ObjectId, userId: Types.ObjectId) {
    const game = await this.gameSessionService.leave(gameId.toHexString(), userId.toHexString());

    this.publishActiveGames();
    return game;
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: Types.ObjectId) {
    return `This action returns a #${id} game`;
  }

}
