import { Field, Int, ObjectType } from '@nestjs/graphql';
import { prop } from '@typegoose/typegoose';

@ObjectType()
export class Resources {

  @Field(() => Int, { nullable: true })
  @prop()
  lives?: number;

  @Field(() => Int, { nullable: true })
  @prop()
  money?: number;

  @Field(() => Int, { nullable: true })
  @prop()
  white?: number;

  @Field(() => Int, { nullable: true })
  @prop()
  dark?: number;

}
