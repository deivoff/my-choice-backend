import { Field, ObjectType } from '@nestjs/graphql';
import { Types } from "mongoose";
import { prop } from '@typegoose/typegoose';
import { User } from 'src/models/user/entities/user.entity';

@ObjectType()
export class Tournament {

  @Field()
  readonly _id!: Types.ObjectId;

  @prop({ ref: User })
  creator: Types.ObjectId;

  @Field()
  @prop()
  name: string;

}
