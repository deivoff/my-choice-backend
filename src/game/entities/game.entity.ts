import { ObjectType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class Game {

  @Field()
  readonly _id: Types.ObjectId;

  @Field()
  name: string;
}
