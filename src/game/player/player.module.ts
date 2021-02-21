import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { PlayerService } from 'src/game/player/player.service';

@Module({
  providers: [
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
    PlayerService,
  ]
})
export class PlayerModule {}
