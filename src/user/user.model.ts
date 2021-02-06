import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
import { ObjectIdScalar } from '$common/scalars/objectId.scalar';

@ObjectType()
export class UserPhoto {

  @Field(() => String)
  @Prop({ required: true })
  url!: string;

}

@ObjectType()
class VKProvider {

  @Field()
  @Prop({ required: true })
  id!: string;

  @Field()
  get link(): string {
    return 'https://vk.com/id' + this.id
  }

  @Field()
  @Prop({ required: true })
  token!: string;

}

@ObjectType()
class UserSocial {

  @Field(() => VKProvider)
  @Prop({ _id: false })
  vkProvider!: VKProvider;

}

@ObjectType()
export class UserName {

  @Field(() => String)
  @Prop({ required: true })
  familyName!: string;

  @Field(() => String)
  @Prop({ required: true })
  givenName!: string;

}

@ObjectType()
@Schema()
export class UserModel {

  @Field()
  readonly _id!: Types.ObjectId;

  @Field({ nullable: true })
  @Prop()
  email?: string;

  @Field(() => UserName)
  @Prop({ _id: false })
  name!: UserName;

  @Field(() => [UserPhoto])
  @Prop({ type: UserPhoto, _id: false })
  photos?: UserPhoto[];

  @Field(() => UserSocial)
  @Prop({ _id: false })
  social!: UserSocial;

}

export type UserDocument = UserModel & Document;
export const UserSchema = SchemaFactory.createForClass(UserModel);
