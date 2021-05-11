import { Field, ObjectType, PickType, registerEnumType } from '@nestjs/graphql';
import { Game } from 'src/models/game/game.entity';
import { Types } from 'mongoose';

export enum GameStatus {
  Awaiting = 'Awaiting',
  ChoiceDream = 'ChoiceDream',
  InProgress = 'InProgress',
  Finished = 'Finished'
}

registerEnumType(GameStatus, {
  name: 'GameStatus',
});


@ObjectType()
export class GameSession extends PickType(Game, ['_id', 'name', 'creator']){

  mover?: string;

  winner?: string;

  players?: string[];

  tournament?: Types.ObjectId;

  observers?: string[];

  @Field()
  creator: Types.ObjectId;

  @Field(() => GameStatus)
  status: GameStatus

}
