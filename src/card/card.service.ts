import { Injectable } from '@nestjs/common';
import { CreateCardInput } from './dto/create-card.input';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Card } from 'src/card/entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card) private readonly cardModel: ReturnModelType<typeof Card>
  ) {}
  create(createGameFieldInput: CreateCardInput) {
    return this.cardModel.create(createGameFieldInput);
  }

  findAll() {
    return this.cardModel.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} gameField`;
  }

}
