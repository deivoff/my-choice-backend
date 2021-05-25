import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Game } from 'src/models/game/game.entity';

@ObjectType()
export class GamesWithCounter {

  @Field(() => [Game])
  games: Game[];

  @Field(() => Int)
  totalCount: number;

}
