import { Field, InputType } from '@nestjs/graphql';
import { FieldType } from 'src/game/field/field.dictionaries';

@InputType({
  isAbstract: true
})
export class CardInput {

  @Field(() => FieldType)
  type: FieldType;

  @Field()
  description: string;

}
