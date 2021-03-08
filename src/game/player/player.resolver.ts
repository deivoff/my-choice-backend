import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Player } from 'src/game/player/player.entity';
import { Resources } from 'src/game/resources/resources.entity';
import { PlayerService } from 'src/game/player/player.service';

@Resolver(() => Player)
export class PlayerResolver {
  constructor(
    private readonly playerService: PlayerService,
  ) {}

  @ResolveField(() => Resources, { nullable: true })
  resources(
    @Parent() {
      resources
    }: Player,
  ) {
    return this.playerService.getResources(resources);
  }

}
