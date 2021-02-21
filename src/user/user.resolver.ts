import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { DecodedUser, User } from './entities/user.entity';
import { Types } from "mongoose";
import { UserService } from 'src/user/user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'user', nullable: true })
  findOne(
    @Args('_id', ) _id: Types.ObjectId,
  ) {
    return this.userService.findOne(_id);
  }

  @ResolveField(() => String)
  nickname(
    @Parent() user: User
  ) {
    return user.nickname || `${user.name.givenName} ${user.name.familyName}`
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  updateNickname(
    @Args('nickname') newNickname: string,
    @DecodedUser() { _id }: DecodedUser
  ) {
    return this.userService.updateNickname(_id, newNickname)
  }

}
