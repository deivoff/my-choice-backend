import { Field, InputType } from '@nestjs/graphql';
import { FieldType } from 'src/game-field/entities/game-field.entity';

@InputType()
export class CreateFieldInput {

  @Field(() => FieldType)
  type: FieldType;

  @Field()
  description: string;

}
