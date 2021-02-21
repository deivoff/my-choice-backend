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
    private readonly gameSessionService: GameSessionService,
    @Inject('PUB_SUB') private readonly  pubSub: PubSubEngine
) {}

  async create(createGameInput: { name: string; creator: Types.ObjectId, observerMode?: boolean }) {
    const gameId = Types.ObjectId();
    const creatorId = createGameInput.creator.toHexString();
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

    const activeGames = await this.gameSessionService.getAllAwaiting();

    await this.pubSub.publish('lobby', {
      lobby: activeGames
    });

    return this.gameModel.create({
      _id: gameId,
      name: createGameInput.name,
      creator: createGameInput.creator,
    });
  }

  join(gameId: Types.ObjectId, userId: Types.ObjectId) {
    console.log('joined', gameId, userId);
    return 'joined'
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: Types.ObjectId) {
    return `This action returns a #${id} game`;
  }

  update(id: Types.ObjectId, updateGameInput: UpdateGameInput) {
    return `This action updates a #${id} game`;
  }

  remove(id: Types.ObjectId) {
    return `This action removes a #${id} game`;
  }
}
