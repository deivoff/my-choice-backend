import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { PlayerService } from 'src/game/player/player.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PlayerResolver } from 'src/game/player/player.resolver';

@Module({
  imports: [
    UserModule,
  ],
  providers: [
    PlayerService,
    UserService,
    PlayerResolver,
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
