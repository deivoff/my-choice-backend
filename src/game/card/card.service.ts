import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Card, ChoiceCard, Opportunity, Option } from 'src/game/card/entities/card.entity';
import { Types } from 'mongoose';
import { CreateIncidentCardInput } from 'src/game/card/dto/create-incident-card.input';
import { CreateChoicesCardInput } from 'src/game/card/dto/create-choices-card.input';
import { FieldType } from 'src/game/field/field.dictionaries';
import { ID, objectIdToString } from 'src/utils';
import { Redis } from 'ioredis';
import { UpdateChoicesCardInput } from 'src/game/card/dto/update-choices-card.input';
import { UpdateIncidentCardInput } from 'src/game/card/dto/update-incident-card.input';
import { CARD_NOT_FOUND } from 'src/game/card/card.errors';
import { getOpportunityDescription, OpportunityCardType } from 'src/game/card/entities/opportunity.utils';

@Injectable()
export class CardService {
  constructor(
    @Inject('PUBLISHER') private readonly redisClient: Redis,
    @InjectModel(Card) private readonly cardModel: ReturnModelType<typeof Card>
  ) {}

  private key = (type: FieldType, _id: string = '') => {
    return `cards:${type}:${_id}`
  };

  createChoicesCard = (createChoicesCardInput: CreateChoicesCardInput) => {
    return this.cardModel.create(createChoicesCardInput);
  };

  updateChoicesCard = async (cardId: ID, { description, type, choices }: UpdateChoicesCardInput) => {
    const doc = await this.cardModel.findById(cardId) as DocumentType<ChoiceCard | null>;
    if (!doc) {
      throw new Error(CARD_NOT_FOUND);
    }

    if (description && doc.description !== description) {
      doc.description = description;
    }

    if (choices) {
      doc.choices = choices as Option[]
    }

    if (type && doc.type !== type) {
      doc.type = type
    }

    await doc.save();
    return doc;
  };

  createIncidentCard = (createIncidentCard: CreateIncidentCardInput) => {
    return this.cardModel.create({
      ...createIncidentCard,
      type: FieldType.Incident,
    });
  };

  updateIncidentCard = (cardId: ID, updateIncidentCard: UpdateIncidentCardInput) => {
    return this.cardModel.findByIdAndUpdate(cardId, updateIncidentCard);
  };

  remove = (cardId: Types.ObjectId) => {
    return this.cardModel.findByIdAndRemove(cardId)
  };

  getOpportunityCard = (type: OpportunityCardType): Opportunity => ({
    _id: Types.ObjectId(),
    type: FieldType.Opportunity,
    description: getOpportunityDescription(type),
    canTryLuck: type === OpportunityCardType.tryYourLuck,
  });

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
