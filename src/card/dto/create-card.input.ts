import { Field, InputType } from '@nestjs/graphql';
import { FieldType } from 'src/card/entities/card.entity';

@InputType()
export class CreateCardInput {

  @Field(() => FieldType)
  type: FieldType;

  @Field()
  description: string;

}
