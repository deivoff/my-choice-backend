import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { GameSessionService } from 'src/game/game-session/game-session.service';
import { PlayerModule } from 'src/game/player/player.module';
import { PlayerService } from 'src/game/player/player.service';
import { GameSessionResolver } from 'src/game/game-session/game-session.resolver';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { CardModule } from 'src/game/card/card.module';
import { CardService } from 'src/game/card/card.service';

@Module({
  imports: [
    PlayerModule,
    UserModule,
    CardModule,
  ],
  providers: [
    PlayerService,
    UserService,
    CardService,
    GameSessionService,
    GameSessionResolver,
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
