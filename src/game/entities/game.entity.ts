import { ObjectType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { prop } from '@typegoose/typegoose';

@ObjectType()
export class Game {

  @Field()
  readonly _id: Types.ObjectId;

  @Field()
  @prop()
  name: string;

  @prop({ ref: User })
  creator: Types.ObjectId;

}
