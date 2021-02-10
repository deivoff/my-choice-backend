import { Injectable } from '@nestjs/common';
import { UpdateGameInput } from './dto/update-game.input';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Game } from 'src/game/entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game) private readonly gameModel: ReturnModelType<typeof Game>
  ) {}

  create(createGameInput: { name: string; creator: Types.ObjectId}) {
    return this.gameModel.create(createGameInput);
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
