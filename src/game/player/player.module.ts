import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { PlayerService } from 'src/game/player/player.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PlayerResolver } from 'src/game/player/player.resolver';
import { CardModule } from 'src/game/card/card.module';
import { CardService } from 'src/game/card/card.service';

@Module({
  imports: [
    UserModule,
    CardModule,
  ],
  providers: [
    PlayerService,
    UserService,
    PlayerResolver,
    CardService,
    {
      provide: 'PUBLISHER',
      useFactory: (redisService: RedisService) => {
        return redisService.getClient('publisher')
      },
      inject: [RedisService]
    },
  ],
  exports: [
    PlayerService,
  ]
})
export class PlayerModule {}
