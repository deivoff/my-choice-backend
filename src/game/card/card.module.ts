import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CardService } from 'src/game/card/card.service';
import { CardResolver } from 'src/game/card/card.resolver';
import {
  DreamTest,
  Card,
  Incident,
  Offer,
  Reaction,
  Situation,
} from 'src/game/card/entities/card.entity';
import { FieldType } from 'src/game/field/field.dictionaries';

@Module({
  imports: [TypegooseModule.forFeature([
    {
      schemaOptions: { discriminatorKey: 'type', collection: 'cards' },
      typegooseClass: Card,
      discriminators: [
        { typegooseClass: DreamTest, discriminatorId: FieldType.Dream },
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
