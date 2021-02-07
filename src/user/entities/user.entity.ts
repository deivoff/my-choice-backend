import { Field, ObjectType } from '@nestjs/graphql';
import { sign } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';
import { ConfigService } from '@nestjs/config';



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
        id: this._id,
      },
      secret,
      { expiresIn: '50d' },
    );
  }

}
