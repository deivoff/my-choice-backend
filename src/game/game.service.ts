import { Injectable } from '@nestjs/common';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Types } from 'mongoose';

@Injectable()
export class GameService {
  create(createGameInput: CreateGameInput) {
    return 'This action adds a new game';
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
