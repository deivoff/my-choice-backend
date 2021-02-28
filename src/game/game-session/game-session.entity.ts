import { Field, ObjectType, PickType, registerEnumType } from '@nestjs/graphql';
import { Game } from 'src/game/game.entity';

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

  currentMover?: string;

  winner?: string;

  players: string;

  observers: string;

  @Field(() => GameStatus)
  status: GameStatus

}
