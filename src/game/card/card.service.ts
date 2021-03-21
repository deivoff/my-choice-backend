import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Card } from 'src/game/card/entities/card.entity';
import { Types } from 'mongoose';
import { IncidentCardInput } from 'src/game/card/dto/create-incident-card.input';
import { ChoicesCardInput } from 'src/game/card/dto/create-choices-card.input';
import { FieldType } from 'src/game/field/field.dictionaries';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card) private readonly cardModel: ReturnModelType<typeof Card>
  ) {}
  createChoicesCard = (createChoicesCardInput: ChoicesCardInput) => {
    return this.cardModel.create(createChoicesCardInput);
  };

  createIncidentCard = (createIncidentCard: IncidentCardInput) => {
    return this.cardModel.create({
      ...createIncidentCard,
      type: FieldType.Incident,
    });
  };

  remove = (cardId: Types.ObjectId) => {
    return this.cardModel.findByIdAndRemove(cardId)
  };

  findAll = () => {
    return this.cardModel.find();
  };

  findOne = (_id: Types.ObjectId) => {
    return this.cardModel.findById(_id);
  }

}
