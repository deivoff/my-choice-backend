import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from 'src/game/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { Types } from 'mongoose';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DecodedUser, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { PubSubEngine } from 'graphql-subscriptions';
import { GameSession } from 'src/game/game-session/game-session.entity';
import { Player } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';
import { Card, DroppedCard } from 'src/game/card/entities/card.entity';

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
  async startGame(
    @Args('gameId') gameId: Types.ObjectId,
    @DecodedUser() { _id }: DecodedUser
  ) {
    await this.gameService.start(gameId, _id);
    return true;
  }

  @UseGuards(AuthGuard)
  @Query(() => GameSession)
  joinGame(
    @Args('gameId') gameId: Types.ObjectId,
    @DecodedUser() decodedUser: DecodedUser
  ) {
    return this.gameService.join(gameId, decodedUser._id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async leaveGame(
    @DecodedUser() decodedUser: DecodedUser
  ) {
    await this.gameService.leave(decodedUser._id);
    return true
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async choiceDream(
    @Args('dream', { type: () => Int }) dream: number,
    @DecodedUser() decodedUser: DecodedUser
  ) {
    await this.gameService.choiceDream(dream, decodedUser._id);
    return true
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async move(
    @Args('moveCount', { type: () => Int }) moveCount: number,
    @DecodedUser() decodedUser: DecodedUser
  ) {
    await this.gameService.playerMove(moveCount, decodedUser._id);

    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async choice(
    @DecodedUser() decodedUser: DecodedUser,
    @Args('cardId') cardId: Types.ObjectId,
    @Args('choiceId', { nullable: true }) choiceId?: Types.ObjectId,
  ) {
    await this.gameService.choice(cardId, decodedUser._id, choiceId);
    return true
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async opportunityResult(
    @DecodedUser() decodedUser: DecodedUser,
    @Args('diceResult', { type: () => Int, nullable: true }) diceResult?: number,
  ) {
    await this.gameService.updateAfterOpportunity(decodedUser._id, diceResult);

    return true
  }

  @Subscription(() => GameSession, {
    filter: (
      payload: { updateActiveGame: GameSession },
      variables: { gameId: Types.ObjectId }
      ) => {
      return objectIdToString(payload.updateActiveGame._id) === objectIdToString(variables.gameId);
    },
  })
  async updateActiveGame(
    @Args('gameId') gameId: Types.ObjectId
  ) {
    return this.pubSub.asyncIterator('updateActiveGame');
  }

  @Subscription(() => DroppedCard, {
    filter: (
      payload: {
        cardDropped: Card,
        gameId: ID,
        userId: ID,
      },
      variables: { gameId: Types.ObjectId }
    ) => {
      return objectIdToString(payload.gameId) === objectIdToString(variables.gameId);
    },
    resolve: (
      payload: {
        cardDropped: Card,
        gameId: ID,
        userId: ID,
      },
    ): DroppedCard => {
      return ({
        card: payload.cardDropped,
        forPlayer: Types.ObjectId(objectIdToString(payload.userId)),
      });
    }
  })
  async cardDropped(
    @Args('gameId') gameId: Types.ObjectId
  ) {
    return this.pubSub.asyncIterator('cardDropped')
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
    return this.userService.findMany(players ?? []);
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
