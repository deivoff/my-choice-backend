import { Injectable } from '@nestjs/common';
import { ChoicesCardInput } from 'src/game/card/dto/create-card.input';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Card } from 'src/game/card/entities/card.entity';
import { Types } from 'mongoose';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card) private readonly cardModel: ReturnModelType<typeof Card>
  ) {}
  create(createGameFieldInput: ChoicesCardInput) {
    return this.cardModel.create(createGameFieldInput);
  }

  findAll() {
    return this.cardModel.find();
  }

  findOne(_id: Types.ObjectId) {
    return this.cardModel.findById(_id);
  }

}
