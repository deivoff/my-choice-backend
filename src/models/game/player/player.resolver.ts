import { Resolver } from '@nestjs/graphql';
import { Player } from 'src/models/game/player/player.entity';
import { PlayerService } from 'src/models/game/player/player.service';

@Resolver(() => Player)
export class PlayerResolver {
  constructor(
    private readonly playerService: PlayerService,
  ) {}

}
