import { Field, ObjectType, PickType, registerEnumType, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Resources } from 'src/game/resources/resources.entity';

export enum PlayerPosition {
  Awaiting = 'Awaiting',
  Start = 'Start',
  Inner = 'Inner',
  Outer = 'Outer',
}

export enum PlayerStatus {
  Awaiting = 'Awaiting',
  InGame = 'InGame',
  Gameover = 'Gameover',
  Hold = 'Hold',
  Winner = 'Winner',
}

registerEnumType(PlayerPosition, {
  name: 'PlayerPosition',
});

registerEnumType(PlayerStatus, {
  name: 'PlayerStatus'
});

@ObjectType()
export class Player extends PickType(User, ['_id']){

  @Field({ nullable: true })
  avatar: string;

  @Field()
  nickname: string;

  @Field(() => Resources, { nullable: true })
  resources?: Resources;

  @Field(() => PlayerPosition, { nullable: true })
  position?: PlayerPosition;

  @Field(() => PlayerStatus)
  status: PlayerStatus;

  @Field(() => Int, { nullable: true })
  hold?: number;

}
