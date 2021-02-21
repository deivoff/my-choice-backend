import { User } from 'src/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { prop, Ref } from '@typegoose/typegoose';

@ObjectType()
export class Message {
  @Field(() => Types.ObjectId)
  readonly _id!: Types.ObjectId |  string;

  @prop({ ref: User })
  author: Types.ObjectId;

  @prop({ required: true })
  topic!: string;

  @Field()
  @prop({ required: true })
  message!: string;

}
