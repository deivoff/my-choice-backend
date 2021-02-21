import { Field, InputType } from '@nestjs/graphql';
import { FieldType } from 'src/game/field/field.dictionaries';

@InputType()
export class CreateCardInput {

  @Field(() => FieldType)
  type: FieldType;

  @Field()
  description: string;

}
