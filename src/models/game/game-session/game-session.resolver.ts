import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { Player } from 'src/models/game/player/player.entity';
import getTimeout from 'src/timeout';

import { GameSession } from './game-session.entity';
import { GameSessionService } from './game-session.service';
import { GameSessionTimers } from './dto/timers.entity';

@Resolver(() => GameSession)
export class GameSessionResolver {
  constructor(
    private readonly gameSessionService: GameSessionService,
  ) {}

  @ResolveField(() => Types.ObjectId, { nullable: true })
  mover(
    @Parent() {
      mover
    }: GameSession
  ) {
    return mover
  }

  @ResolveField(() => Types.ObjectId, { nullable: true })
  winner(
    @Parent() {
      winner
    }: GameSession
  ) {
    return winner
  }

  @ResolveField(() => [Player])
  players(
    @Parent() gameSession: GameSession,
  ) {
    if (!gameSession?.players?.length) return [];
    return this.gameSessionService.getPlayers(
      gameSession._id,
      gameSession.players || []
    );
  }

  @ResolveField(() => Int)
  playersCount(
    @Parent() {
      players
    }: GameSession,
  ) {
    return players?.length || 0;
  }

  @ResolveField(() => GameSessionTimers, { nullable: true })
  timers(
    @Parent() {
      _id
    }: GameSession
  ): GameSessionTimers | null {
    const moveTimer = getTimeout('move')(_id).getTimerStart();
    const choiceTimer = getTimeout('choice')(_id).getTimerStart();
    const dreamTimer = getTimeout('dream')(_id).getTimerStart();

    if (!moveTimer && !choiceTimer && !dreamTimer) return null;

    return {
      card: choiceTimer ? new Date(choiceTimer) : null,
      dice: moveTimer ? new Date(moveTimer) : null,
      dream: dreamTimer ? new Date(dreamTimer) : null,
    }
  }

  @ResolveField(() => Int)
  observers(
    @Parent() {
      observers
    }: GameSession,
  ) {
    return this.gameSessionService.getObserversCount(observers || [])
  }
}
