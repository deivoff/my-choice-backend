import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {

  @Field()
  token!: string;

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
