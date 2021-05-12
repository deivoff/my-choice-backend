import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CardService } from 'src/models/game/card/card.service';
import { CardResolver } from 'src/models/game/card/card.resolver';
import { Card, Dream, Incident, Offer, Opportunity, Reaction, Situation } from 'src/models/game/card/entities/card.entity';
import { FieldType } from 'src/models/game/field/field.dictionaries';
import { RedisService } from 'nestjs-redis';


const CardModel = TypegooseModule.forFeature([
  {
    schemaOptions: { discriminatorKey: 'type', collection: 'cards' },
    typegooseClass: Card,
    discriminators: [
      { typegooseClass: Dream, discriminatorId: FieldType.Dream },
      { typegooseClass: Situation, discriminatorId: FieldType.Situation },
      { typegooseClass: Reaction, discriminatorId: FieldType.Reaction },
      { typegooseClass: Offer, discriminatorId: FieldType.Offer },
      { typegooseClass: Incident, discriminatorId: FieldType.Incident },
    ],
  },
]);

@Module({
  imports: [CardModel],
  providers: [
    CardResolver,
    CardService,
    {
      provide: 'PUBLISHER',
      useFactory: (redisService: RedisService) => {
        return redisService.getClient('publisher')
      },
    inject: [RedisService]
  },],
  exports: [CardService, CardModel],
})
export class CardModule {}
