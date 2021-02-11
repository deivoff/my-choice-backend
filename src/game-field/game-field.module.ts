import { Module } from '@nestjs/common';
import { GameFieldService } from './game-field.service';
import { GameFieldResolver } from './game-field.resolver';
import { TypegooseModule } from 'nestjs-typegoose';
import {
  DreamTest,
  Field,
  FieldType, Incident,
  Offer,
  Opportunity,
  Reaction,
  Situation,
} from 'src/game-field/entities/game-field.entity';

@Module({
  imports: [TypegooseModule.forFeature([
    {
      schemaOptions: { discriminatorKey: 'type', collection: 'game-fields' },
      typegooseClass: Field,
      discriminators: [
        { typegooseClass: DreamTest, discriminatorId: FieldType.DreamTest },
        { typegooseClass: Situation, discriminatorId: FieldType.Situation },
        { typegooseClass: Reaction, discriminatorId: FieldType.Reaction },
        { typegooseClass: Offer, discriminatorId: FieldType.Offer },
        { typegooseClass: Opportunity, discriminatorId: FieldType.Opportunity },
        { typegooseClass: Incident, discriminatorId: FieldType.Incident },
      ],
    },
  ])],
  providers: [GameFieldResolver, GameFieldService]
})
export class GameFieldModule {}
