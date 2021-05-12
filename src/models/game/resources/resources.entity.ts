import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { prop } from '@typegoose/typegoose';

export enum ResourceType {
  lives = 'lives',
  money = 'money',
  white = 'white',
  dark = 'dark',
}

registerEnumType(ResourceType, {
  name: 'ResourceType'
});

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
