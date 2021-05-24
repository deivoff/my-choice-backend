import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';

import * as DataLoader from 'dataloader';
import { Loader } from 'src/dataloader';

import { DecodedUser, User } from 'src/models/user/entities/user.entity';
import { AuthGuard } from 'src/models/auth/auth.guard';
import { UserService } from 'src/models/user/user.service';
import { objectIdToString } from 'src/common/scalars/objectId.scalar';

import { GameSession } from './game-session/game-session.entity';
import { CreateGameInput } from './dto/create-game.input';
import { ChoiceOption, DroppedCard } from './card/entities/card.entity';
import { ShareResourcesInput } from './dto/share-resources.input';

import { GameService } from './game.service';
import { Game } from './game.entity';
import { SentryInterceptor } from 'src/sentry/sentry.interceptor';
import { UserLoader } from 'src/models/user/user.loader';
import { Tournament } from 'src/models/tournament/entities/tournament.entity';
import { TournamentLoader } from 'src/models/tournament/tournament.loader';
import {
  CardDroppedPayload,
  filterGameSessionSubscription, PlayerChoicePayload,
  UpdateActiveGamePayload,
} from 'src/models/game/game.utils';

@UseInterceptors(SentryInterceptor)
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
    @Args('createGameInput') { name, observerMode, tournament}: CreateGameInput,
    @DecodedUser() { _id }: DecodedUser
  ) {
    return this.gameService.createGameSession({
      name,
      tournament,
      creator: Types.ObjectId(_id),
      observerMode
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteGame(
    @Args('gameId') gameId: Types.ObjectId,
  ) {
    await this.gameService.deleteGameSession(gameId);
    return true;
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
    @DecodedUser() { _id }: DecodedUser
  ) {
    return this.gameService.join(gameId, Types.ObjectId(_id));
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async leaveGame(
    @Args('gameId') gameId: Types.ObjectId,
    @DecodedUser() { _id }: DecodedUser
  ) {
    await this.gameService.leave(Types.ObjectId(_id), gameId);
    return true
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async choiceDream(
    @Args('dream', { type: () => Int }) dream: number,
    @DecodedUser() { _id }: DecodedUser
  ) {
    await this.gameService.choiceDream(dream, Types.ObjectId(_id));
    return true
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async move(
    @Args('moveCount', { type: () => Int }) moveCount: number,
    @DecodedUser() { _id }: DecodedUser
  ) {
    await this.gameService.playerMove(moveCount, Types.ObjectId(_id));

    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async choice(
    @DecodedUser() { _id }: DecodedUser,
    @Args('cardId') cardId: Types.ObjectId,
    @Args('choiceId', { nullable: true }) choiceId?: Types.ObjectId,
  ) {
    await this.gameService.choice(Types.ObjectId(_id), cardId, choiceId);
    return true
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async shareResources(
    @DecodedUser() decodedUser: DecodedUser,
    @Args('shareResourcesInput') shareResourcesInput: ShareResourcesInput,
  ) {
    await this.gameService.shareResources(shareResourcesInput, decodedUser._id);
    return true
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async opportunityResult(
    @DecodedUser() { _id }: DecodedUser,
    @Args('opportunityId') opportunityId: Types.ObjectId,
    @Args('diceResult', { type: () => Int, nullable: true }) diceResult?: number,
  ) {
    await this.gameService.updateAfterOpportunity(
      Types.ObjectId(_id),
      opportunityId,
      diceResult,
    );

    return true
  }

  @Subscription(() => GameSession, {
    filter: filterGameSessionSubscription,
    resolve: (
      payload: UpdateActiveGamePayload
    ): GameSession => payload.game
  })
  async updateActiveGame(
    @Args('gameId') gameId: Types.ObjectId
  ) {
    return this.pubSub.asyncIterator('updateActiveGame');
  }

  @Subscription(() => DroppedCard, {
    filter: filterGameSessionSubscription,
    resolve: (
      payload: CardDroppedPayload
    ): DroppedCard => ({
      card: payload.cardDropped,
      forPlayer: Types.ObjectId(objectIdToString(payload.userId)),
    })
  })
  async cardDropped(
    @Args('gameId') gameId: Types.ObjectId
  ) {
    return this.pubSub.asyncIterator('cardDropped')
  }

  @Subscription(() => ChoiceOption, {
    filter: filterGameSessionSubscription,
    resolve: (
      payload: PlayerChoicePayload,
    ): ChoiceOption => ({
      cardId: payload.cardId as Types.ObjectId,
      choiceId: payload.choiceId as Types.ObjectId | undefined,
    })
  })
  playerChoice(
    @Args('gameId') gameId: Types.ObjectId,
  ) {
    return this.pubSub.asyncIterator('playerChoice')
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
    @Loader(UserLoader) userLoader: DataLoader<User['_id'], User>
  ) {
    const { creator } = game;
    return userLoader.load(creator);
  }

  @ResolveField(() => User, { nullable: true })
  async winner(
    @Parent() game: Game,
    @Loader(UserLoader) userLoader: DataLoader<User['_id'], User>
  ) {
    const { winner } = game;
    return winner ? userLoader.load(winner) : null;
  }

  @ResolveField(() => Date)
  createdAt(
    @Parent() { _id }: Game
  ) {
    return _id.getTimestamp();
  }

  @ResolveField(() => Tournament, { nullable: true })
  async tournament(
    @Parent() game: Game,
    @Loader(TournamentLoader) tournamentLoader: DataLoader<Tournament['_id'], Tournament>
  ) {
    const { tournament } = game;
    return tournament ? tournamentLoader.load(tournament) : null;
  }

  @ResolveField(() => [User])
  async players(
    @Parent() game: Game,
    @Loader(UserLoader) userLoader: DataLoader<User['_id'], User>
  ) {
    const { players } = game;
    return userLoader.loadMany(players ?? []);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Game], { name: 'userGames' })
  findAllUserGames(
    @DecodedUser() { _id }: DecodedUser,
    @Args('userId', { nullable: true }) userId?: Types.ObjectId,
  ) {
    if (userId) return this.gameService.findAllUserGames(userId);
    return this.gameService.findAllUserGames(Types.ObjectId(_id));
  }


  @UseGuards(AuthGuard)
  @Query(() => [Game], { name: 'tournamentGames' })
  findAllTournamentGames(
    @DecodedUser() { _id }: DecodedUser,
    @Args('tournamentId', { nullable: true }) tournamentId?: Types.ObjectId,
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
    @Args('offset', { nullable: true, type: () => Int  }) offset?: number,

  ) {
    return this.gameService.findLimitGames(limit, offset, tournamentId);
  }


  @UseGuards(AuthGuard)
  @Query(() => Game, { name: 'game' })
  findOne(@Args('_id', ) _id: Types.ObjectId) {
    return this.gameService.findOne(_id);
  }

}
