import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Types } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DecodedUser, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver(() => Game)
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Game)
  createGame(
    @Args('createGameInput') createGameInput: CreateGameInput,
    @DecodedUser() decodedUser: DecodedUser
  ) {
    return this.gameService.create({
      name: createGameInput.name,
      creator: decodedUser._id
    });
  }

  @ResolveField(() => User)
  async creator(
    @Parent() game: Game,
  ) {
    const { creator } = game;
    return this.userService.findOne(creator);
  }

  @Query(() => [Game], { name: 'games' })
  findAll() {
    return this.gameService.findAll();
  }

  @Query(() => Game, { name: 'game' })
  findOne(@Args('_id', ) _id: Types.ObjectId) {
    return this.gameService.findOne(_id);
  }

  @Mutation(() => Game)
  updateGame(@Args('updateGameInput') updateGameInput: UpdateGameInput) {
    return this.gameService.update(updateGameInput._id, updateGameInput);
  }

  @Mutation(() => Game)
  removeGame(@Args('_id', ) _id: Types.ObjectId) {
    return this.gameService.remove(_id);
  }
}
