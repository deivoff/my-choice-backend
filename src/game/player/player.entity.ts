import { Field, ObjectType, registerEnumType, Int } from '@nestjs/graphql';
import { Types } from 'mongoose';

export enum PlayerPosition {
  Awaiting = 'Awaiting',
  Start = 'Start',
  Inner = 'Inner',
  Outer = 'Outer',
}

export enum PlayerStatus {
  Awaiting = 'Awaiting',
  InGame = 'InGame',
  Hold = 'Hold',
  Winner = 'Winner',
  Gameover = 'Gameover'
}

registerEnumType(PlayerPosition, {
  name: 'PlayerPosition',
});

registerEnumType(PlayerStatus, {
  name: 'PlayerStatus'
});

@ObjectType()
export class Player {

  @Field(() => Types.ObjectId)
  _id: string;

  @Field({ nullable: true })
  avatar: string;

  @Field()
  nickname: string;

  @Field(() => PlayerStatus)
  status: PlayerStatus;

  /**
   * @description save resources as array string: white,dark,money,lives.
   */
  resources?: string;

  @Field(() => PlayerPosition, { nullable: true })
  position?: PlayerPosition;

  @Field()
  disconnected?: boolean;

  @Field(() => Int, { nullable: true })
  hold?: number;

}
