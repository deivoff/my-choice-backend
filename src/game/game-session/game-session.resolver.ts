import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GameSession } from 'src/game/game-session/game-session.entity';
import { Player } from 'src/game/player/player.entity';
import { GameSessionService } from 'src/game/game-session/game-session.service';

@Resolver(() => GameSession)
export class GameSessionResolver {
  constructor(
    private readonly gameSessionService: GameSessionService,
  ) {}

  @ResolveField(() => [Player])
  players(
    @Parent() {
      players
    }: GameSession,
  ) {
    return this.gameSessionService.getPlayers(players);
  }

  @ResolveField(() => Int)
  observers(
    @Parent() {
      observers
    }: GameSession,
  ) {
    return this.gameSessionService.getObserversCount(observers)
  }
}
