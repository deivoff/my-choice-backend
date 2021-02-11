import { Injectable } from '@nestjs/common';
import { CreateFieldInput } from './dto/create-game-field.input';

@Injectable()
export class GameFieldService {
  create(createGameFieldInput: CreateFieldInput) {
    return 'This action adds a new gameField';
  }

  findAll() {
    return `This action returns all gameField`;
  }

  findOne(id: string) {
    return `This action returns a #${id} gameField`;
  }

}
