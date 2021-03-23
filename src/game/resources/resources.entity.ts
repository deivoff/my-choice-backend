import { Field, Int, ObjectType } from '@nestjs/graphql';
import { prop } from '@typegoose/typegoose';

@ObjectType()
export class Resources {

  @Field(() => Int, { nullable: true })
  @prop({ type: Number, required: false })
  lives?: number | null;

  @Field(() => Int, { nullable: true })
  @prop({ type: Number, required: false })
  money?: number | null;

  @Field(() => Int, { nullable: true })
  @prop({ type: Number, required: false })
  white?: number | null;

  @Field(() => Int, { nullable: true })
  @prop({ type: Number, required: false })
  dark?: number | null;

}
