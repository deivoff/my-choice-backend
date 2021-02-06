import { Resolver, Query } from '@nestjs/graphql';
import { UserModel } from './user.model';

@Resolver()
export class UserResolver {
  @Query(() => UserModel, { nullable: true })
  async user() {
    return null;
  }
}
