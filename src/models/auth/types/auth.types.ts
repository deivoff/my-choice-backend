import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('TokensInput')
@ObjectType()
export class Tokens {

  @Field()
  access!: string;

  @Field()
  refresh!: string;

}

@ObjectType()
export class AuthRedirect {

  @Field()
  url!: string;

}

export interface AuthData<T = any> {
  accessToken: string;
  refreshToken?: string;
  profile: T;
}
