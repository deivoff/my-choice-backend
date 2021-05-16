import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GameSessionTimers {

  @Field(() => Date, { nullable: true })
  card?: Date | null;

  @Field(() => Date, { nullable: true })
  dice?: Date | null;

}
