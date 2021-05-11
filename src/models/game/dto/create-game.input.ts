import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateGameInput {

  @Field(() => String)
  name: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  observerMode: boolean;

  @Field(() => Types.ObjectId, { nullable: true })
  tournament?: Types.ObjectId;

}
