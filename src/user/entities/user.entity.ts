import { Field, GqlExecutionContext, ObjectType } from '@nestjs/graphql';
import { decode, sign } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from "http";



@ObjectType()
export class UserPhoto {

  @Field(() => String)
  @prop({ required: true })
  url!: string;

}

@ObjectType()
class VKProvider {

  @Field()
  @prop({ required: true })
  id!: string;

  @Field()
  get link(): string {
    return 'https://vk.com/id' + this.id
  }

  @Field()
  @prop({ required: true })
  token!: string;

}

@ObjectType()
class UserSocial {

  @Field(() => VKProvider)
  @prop({ _id: false })
  vkProvider!: VKProvider;

}

@ObjectType()
export class UserName {

  @Field(() => String)
  @prop({ required: true })
  familyName!: string;

  @Field(() => String)
  @prop({ required: true })
  givenName!: string;

}

@ObjectType()
export class User {

  @Field()
  readonly _id!: Types.ObjectId;

  @Field({ nullable: true })
  @prop()
  email?: string;

  @Field(() => UserName)
  @prop({ _id: false })
  name!: UserName;

  @Field(() => [UserPhoto])
  @prop({ type: UserPhoto, _id: false })
  photos?: UserPhoto[];

  @Field(() => UserSocial)
  @prop({ _id: false })
  social!: UserSocial;

  generateJWT(secret: string) {
    return sign(
      {
        email: this.email,
        name: this.name,
        photos: this.photos ? this.photos : [],
        _id: this._id,
      },
      secret,
      { expiresIn: '50d' },
    );
  }

}

export type DecodedUser = Pick<User, 'email' | 'name' | '_id'> & {
  photos: UserPhoto[]
  iat: number;
  exp: number;
}

export const DecodedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { req } = ctx.getArgByIndex<{ req: IncomingMessage }>(2) || {};

    return decode(req.headers.authorization);
  }
);
