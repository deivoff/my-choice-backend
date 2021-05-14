import { Field, ObjectType, PickType, registerEnumType, Int } from '@nestjs/graphql';
import { User, UserSex } from 'src/models/user/entities/user.entity';
import { Resources } from 'src/models/game/resources/resources.entity';
import { Types } from 'mongoose';
import { HashEntity, HashField } from 'src/type-redis';

export enum PlayerPosition {
  Awaiting = 'Awaiting',
  Start = 'Start',
  Inner = 'Inner',
  Outer = 'Outer',
}

registerEnumType(PlayerPosition, {
  name: 'PlayerPosition',
});

@ObjectType()
@HashEntity({
  expires: 60 * 60,
  pk: '_id',
})
export class Player extends PickType(
  User,
  ['_id', 'sex'],
) {

  @HashField()
  readonly _id: Types.ObjectId;

  @HashField({ required: false, type: String })
  sex?: UserSex;

  @Field({ nullable: true })
  @HashField()
  avatar: string;

  @Field(() => Int, { nullable: true })
  @HashField({ type: Number, required: false })
  dream?: number;

  @Field()
  @HashField()
  nickname: string;

  @Field(() => Resources, { nullable: true })
  @HashField({ type: Resources, required: false })
  resources?: Resources;

  @Field(() => PlayerPosition, { nullable: true })
  @HashField({ type: String, required: false })
  position?: PlayerPosition;

  @Field(() => Int, { nullable: true })
  @HashField({ type: Number, required: false })
  cell?: number;

  @Field(() => Int, { nullable: true })
  @HashField({ type: Number, required: false })
  hold?: number;

  @HashField({ type: Types.ObjectId, required: false })
  gameId?: Types.ObjectId;

  @Field(() => Boolean, { nullable: true })
  @HashField({ type: Boolean, required: false })
  disconnected?: boolean;

  @Field(() => Boolean, { nullable: true })
  @HashField({ type: Boolean, required: false })
  gameover?: boolean;

  @Field(() => Boolean, { nullable: true })
  @HashField({ type: Boolean, required: false })
  winner?: boolean;

}
