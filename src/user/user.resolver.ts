import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { Types } from "mongoose";
import { UserService } from 'src/user/user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'user', nullable: true })
  findOne(
    @Args('_id', ) _id: Types.ObjectId,
  ) {
    return this.userService.findOne(_id);
  }

}
