import { CreateGameInput } from './create-game.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field()
  _id: Types.ObjectId;
}
