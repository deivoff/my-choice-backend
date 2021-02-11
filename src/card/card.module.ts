import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CardService } from './card.service';
import { CardResolver } from './card.resolver';
import {
  DreamTest,
  Card,
  FieldType, Incident,
  Offer,
  Reaction,
  Situation,
} from 'src/card/entities/card.entity';

@Module({
  imports: [TypegooseModule.forFeature([
    {
      schemaOptions: { discriminatorKey: 'type', collection: 'cards' },
      typegooseClass: Card,
      discriminators: [
        { typegooseClass: DreamTest, discriminatorId: FieldType.DreamTest },
        { typegooseClass: Situation, discriminatorId: FieldType.Situation },
        { typegooseClass: Reaction, discriminatorId: FieldType.Reaction },
        { typegooseClass: Offer, discriminatorId: FieldType.Offer },
        { typegooseClass: Incident, discriminatorId: FieldType.Incident },
      ],
    },
  ])],
  providers: [CardResolver, CardService]
})
export class CardModule {}
