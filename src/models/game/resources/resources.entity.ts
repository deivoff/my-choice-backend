import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { prop } from '@typegoose/typegoose';
import { HashFieldType } from 'src/type-redis';
import { fromStringToResources, fromResourcesToString } from './resources.redis-adapter';

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
@HashFieldType({
  write: fromResourcesToString,
  read: fromStringToResources
})
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
