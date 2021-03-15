import { Field, InputType, Int, OmitType } from '@nestjs/graphql';
import { FieldType } from 'src/game/field/field.dictionaries';
import { ResourcesInput } from 'src/game/resources/resources.input';
import { CardInput } from 'src/game/card/dto/create-card.input';

@InputType()
export class ResultInput {

  @Field(() => FieldType, { nullable: true })
  move?: FieldType;

  @Field(() => ResourcesInput, { nullable: true })
  resources?: ResourcesInput;

  @Field(() => Int, { nullable: true })
  hold?: number;

  @Field(() => Boolean, { nullable: true })
  gameover?: boolean;

}

@InputType()
export class ActionInput {

  @Field(() => ResourcesInput, { nullable: true})
  less?: ResourcesInput;

  @Field(() => ResourcesInput, { nullable: true})
  more?: ResourcesInput;

  @Field(() => ResultInput, { nullable: true})
  result: ResultInput

}

@InputType()
export class IncidentCardInput extends OmitType(CardInput, ['type']){

  @Field(() => ActionInput)
  action: ActionInput;

}
