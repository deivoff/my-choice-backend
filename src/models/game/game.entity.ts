import { ObjectType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { User } from 'src/models/user/entities/user.entity';
import { prop } from '@typegoose/typegoose';
import { Tournament } from 'src/models/tournament/entities/tournament.entity';

@ObjectType()
export class Game {

  @Field()
  readonly _id: Types.ObjectId;

  @Field()
  @prop()
  name: string;

  @prop({ ref: User })
  creator: Types.ObjectId;

  @prop({ ref: User, required: false })
  winner?: Types.ObjectId;

  @prop({ ref: Tournament, required: false })
  tournament?: Types.ObjectId;

  @prop({ type: [Types.ObjectId], required: false })
  players?: Types.ObjectId[];

  @prop({ type: [Types.ObjectId], required: false })
  observers?: Types.ObjectId[];

}
