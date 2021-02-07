import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class Game {

  @Field()
  readonly _id: Types.ObjectId;

  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
