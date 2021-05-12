import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { PlayerService } from 'src/models/game/player/player.service';
import { UserModule } from 'src/models/user/user.module';
import { UserService } from 'src/models/user/user.service';
import { PlayerResolver } from 'src/models/game/player/player.resolver';
import { CardModule } from 'src/models/game/card/card.module';
import { CardService } from 'src/models/game/card/card.service';

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
