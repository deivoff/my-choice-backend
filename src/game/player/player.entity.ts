import { Field, ObjectType, PickType, registerEnumType, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Resources } from 'src/game/resources/resources.entity';
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
export class Player extends PickType(User, ['_id']){

  @Field({ nullable: true })
  avatar: string;

  @Field(() => Int, { nullable: true })
  dream?: number;

  @Field()
  nickname: string;

  @Field(() => Resources, { nullable: true })
  resources?: Resources;

  @Field(() => PlayerPosition, { nullable: true })
  position?: PlayerPosition;

  @Field(() => Int, { nullable: true })
  hold?: number;

  gameId?: Types.ObjectId | null;

  @Field()
  disconnected?: boolean;

  @Field()
  gameover?: boolean;

  @Field()
  winner?: boolean

}
