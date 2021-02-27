import { Resolver, Query, Mutation, Args, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from 'src/game/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Types } from 'mongoose';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DecodedUser, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { PubSubEngine } from 'graphql-subscriptions';
import { GameSession } from 'src/game/game-session/game-session.entity';
import { Player } from 'src/game/player/player.entity';

@Resolver(() => Game)
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    @Inject('PUB_SUB') private readonly pubSub: PubSubEngine,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => GameSession)
  createGame(
    @Args('createGameInput') { name, observerMode}: CreateGameInput,
    @DecodedUser() { _id }: DecodedUser
  ) {
    return this.gameService.create({
      name,
      creator: _id,
      observerMode
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async joinGame(
    @Args('gameId') gameId: Types.ObjectId,
    @DecodedUser() decodedUser: DecodedUser
  ) {
    await this.gameService.join(gameId, Types.ObjectId(decodedUser._id));
    return true
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async leaveGame(
    @Args('gameId') gameId: Types.ObjectId,
    @DecodedUser() decodedUser: DecodedUser
  ) {
    await this.gameService.leave(gameId, Types.ObjectId(decodedUser._id));
    return true
  }

  @UseGuards(AuthGuard)
  @Subscription(() => GameSession)
  async inGame () {
    return [];
  }

  @Query(() => [GameSession])
  getActiveGames() {
    return this.gameService.getActiveGames()
  }

  @Subscription(() => [GameSession])
  updateActiveGames() {
    return this.pubSub.asyncIterator('updateActiveGames');
  }

  @ResolveField(() => User)
  async creator(
    @Parent() game: Game,
  ) {
    const { creator } = game;
    return this.userService.findOne(creator);
  }

  @ResolveField(() => [Player])
  async players(
    @Parent() game: Game,
  ) {
    const { players } = game;
    return this.userService.findMany(players);
  }

  @Query(() => [Game], { name: 'games' })
  findAll() {
    return this.gameService.findAll();
  }

  @Query(() => Game, { name: 'game' })
  findOne(@Args('_id', ) _id: Types.ObjectId) {
    return this.gameService.findOne(_id);
  }

}
