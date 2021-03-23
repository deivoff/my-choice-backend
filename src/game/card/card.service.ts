import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Card } from 'src/game/card/entities/card.entity';
import { Types } from 'mongoose';
import { IncidentCardInput } from 'src/game/card/dto/create-incident-card.input';
import { ChoicesCardInput } from 'src/game/card/dto/create-choices-card.input';
import { FieldType } from 'src/game/field/field.dictionaries';
import { ID, objectIdToString } from 'src/utils';
import { Redis } from 'ioredis';

@Injectable()
export class CardService {
  constructor(
    @Inject('PUBLISHER') private readonly redisClient: Redis,
    @InjectModel(Card) private readonly cardModel: ReturnModelType<typeof Card>
  ) {}

  private key = (type: FieldType, _id: string = '') => {
    return `cards:${type}:${_id}`
  };

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

  getCardFromDeck = async (gameId: ID, type: FieldType) => {
    const cardId = await this.getCardIdDeck(gameId, type);
    const card = await this.findOne(cardId);
    return card!;
  };

  private getCardIdDeck = async (gameId: ID, type: FieldType) => {
    const deckKey = this.key(type, objectIdToString(gameId));
    let cardId = await this.redisClient.spop(deckKey);


    if (!cardId) {
      let ids = await this.redisClient.smembers(this.key(type));
      if (!ids.length) {
        const dbIds = await this.cardModel.find({ type }).distinct('_id');
        ids = dbIds.map(objectIdToString);

        await this.redisClient.sadd(this.key(type), ...ids);
        await this.redisClient.expire(this.key(type), 60 * 60);
      }

      await this.redisClient.sadd(deckKey, ...ids);

      cardId = await this.redisClient.spop(deckKey);
    }

    return cardId!
  };

  clearDeck = async (gameId: ID) => {
    const gameStringId = objectIdToString(gameId);
    return Promise.all(Object.values(FieldType).map(type =>this.redisClient.del(this.key(type, gameStringId))));
  };

  findAll = () => {
    return this.cardModel.find();
  };

  findOne = (_id: ID) => {
    return this.cardModel.findById(_id);
  }

}
