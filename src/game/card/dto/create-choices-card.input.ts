import { Field, InputType, Int } from '@nestjs/graphql';
import { ResourcesInput } from 'src/game/resources/resources.input';
import { ResultInput } from 'src/game/card/dto/create-incident-card.input';
import { CardInput } from 'src/game/card/dto/create-card.input';



@InputType()
export class ChoicesCardInput extends CardInput {

  @Field(() => [OptionInput])
  choices: OptionInput[];

}

@InputType()
export class OptionInput {

  @Field()
  description: string;

  @Field(() => ResourcesInput)
  resources: ResourcesInput;

}




