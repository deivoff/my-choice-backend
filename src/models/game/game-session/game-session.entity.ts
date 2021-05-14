import { Field, ObjectType, PickType, registerEnumType } from '@nestjs/graphql';
import { Game } from 'src/models/game/game.entity';
import { Types } from 'mongoose';
import { HashEntity, HashField } from 'src/type-redis';

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
@HashEntity({
  expires: 60 * 60,
  pk: '_id',
})
export class GameSession extends PickType(Game, ['_id', 'name', 'creator']){

  @HashField()
  readonly _id: Types.ObjectId;

  @HashField()
  name: string;

  @Field()
  @HashField({ type: Types.ObjectId })
  creator: Types.ObjectId;

  @HashField({ type: Types.ObjectId, required: false })
  mover?: string;

  @HashField({ type: Types.ObjectId, required: false })
  winner?: string;

  @HashField({ type: [Types.ObjectId], required: false })
  players?: string[];

  @HashField({ type: Types.ObjectId, required: false })
  tournament?: Types.ObjectId;

  @HashField({ type: [Types.ObjectId], required: false })
  observers?: string[];

  @Field(() => GameStatus)
  @HashField()
  status: GameStatus

}
