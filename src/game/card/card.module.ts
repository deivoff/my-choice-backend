import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CardService } from 'src/game/card/card.service';
import { CardResolver } from 'src/game/card/card.resolver';
import {
  Dream,
  Card,
  Incident,
  Offer,
  Reaction,
  Situation,
} from 'src/game/card/entities/card.entity';
import { FieldType } from 'src/game/field/field.dictionaries';


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
  providers: [CardResolver, CardService],
  exports: [CardService, CardModel],
})
export class CardModule {}
