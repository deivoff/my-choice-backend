import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GameSession } from 'src/models/game/game-session/game-session.entity';
import { Player } from 'src/models/game/player/player.entity';
import { GameSessionService } from 'src/models/game/game-session/game-session.service';
import { Types } from 'mongoose';

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
    return mover ? Types.ObjectId(mover) : null
  }

  @ResolveField(() => Types.ObjectId, { nullable: true })
  winner(
    @Parent() {
      winner
    }: GameSession
  ) {
    return winner ? Types.ObjectId(winner) : null
  }

  @ResolveField(() => [Player])
  players(
    @Parent() {
      players
    }: GameSession,
  ) {
    return this.gameSessionService.getPlayers(players || []);
  }

  @ResolveField(() => Int)
  playersCount(
    @Parent() {
      players
    }: GameSession,
  ) {
    return players?.length || 0;
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