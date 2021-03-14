import { Field, InputType, Int } from '@nestjs/graphql';
import { FieldType } from 'src/game/field/field.dictionaries';

@InputType()
export class ChoicesCardInput {

  @Field(() => [OptionInput])
  choices: OptionInput[];

  @Field(() => FieldType)
  type: FieldType;

  @Field()
  description: string;

}

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


@InputType()
export class OptionInput {

  @Field()
  description: string;

  @Field(() => ResourcesInput)
  resources: ResourcesInput;

}

