import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGameInput {

  @Field(() => String)
  name: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  observerMode: boolean;

}
