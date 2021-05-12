import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DecodedUser, User } from 'src/models/user/entities/user.entity';
import { Types } from 'mongoose';
import { UserService } from 'src/models/user/user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/models/auth/auth.guard';

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
    return user.nickname;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateNickname(
    @Args('nickname') newNickname: string,
    @DecodedUser() { _id }: DecodedUser
  ) {
    return this.userService.updateNickname(Types.ObjectId(_id), newNickname);
  }

}
