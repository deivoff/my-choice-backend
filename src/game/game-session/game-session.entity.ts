import { Field, ObjectType, PickType, registerEnumType, Int } from '@nestjs/graphql';
import { Player } from 'src/game/player/player.entity';
import { Game } from 'src/game/game.entity';
import { Types } from 'mongoose';

export enum GameStatus {
  Awaiting = 'Awaiting',
  InProgress = 'InProgress',
  Finished = 'Finished'
}

registerEnumType(GameStatus, {
  name: 'GameStatus',
});


@ObjectType()
export class GameSession extends PickType(Game, ['_id', 'name', 'creator']){

  players: string;

  observers: string;

  @Field(() => GameStatus)
  status: GameStatus

}
