import { Field, ObjectType, PickType, registerEnumType, Int } from '@nestjs/graphql';
import { User } from 'src/models/user/entities/user.entity';
import { Resources } from 'src/models/game/resources/resources.entity';
import { Types } from 'mongoose';

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
export class Player extends PickType(User, ['_id', 'sex']){

  @Field({ nullable: true })
  avatar: string;

  @Field(() => Int, { nullable: true })
  dream?: number | null;

  @Field()
  nickname: string;

  @Field(() => Resources, { nullable: true })
  resources?: Resources | null;

  @Field(() => PlayerPosition, { nullable: true })
  position?: PlayerPosition | null;

  @Field(() => Int, { nullable: true })
  cell?: number | null;

  @Field(() => Int, { nullable: true })
  hold?: number | null;

  gameId?: Types.ObjectId | null;

  @Field(() => Boolean, { nullable: true })
  disconnected?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  gameover?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  winner?: boolean | null;

}
