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
  async players(
    @Parent() {
      players
    }: GameSession,
  ) {
    const pl = await this.gameSessionService.getPlayers(players);
    console.log(pl);
    return pl;
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
