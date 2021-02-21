import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { GameSessionService } from 'src/game/game-session/game-session.service';
import { PlayerModule } from 'src/game/player/player.module';
import { PlayerService } from 'src/game/player/player.service';
import { GameSessionResolver } from 'src/game/game-session/game-session.resolver';

@Module({
  imports: [
    PlayerModule
  ],
  providers: [
    GameSessionService,
    GameSessionResolver,
    PlayerService,
    {
      provide: 'PUBLISHER',
      useFactory: (redisService: RedisService) => {
        return redisService.getClient('publisher')
      },
      inject: [RedisService]
    },
  ],
  exports: [
    GameSessionService,
  ]
})
export class GameSessionModule {}
