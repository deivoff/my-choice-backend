import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ResourcesInput {

  @Field(() => Int, { nullable: true })
  lives?: number;

  @Field(() => Int, { nullable: true })
  money?: number;

  @Field(() => Int, { nullable: true })
  white?: number;

  @Field(() => Int, { nullable: true })
  dark?: number;

}
