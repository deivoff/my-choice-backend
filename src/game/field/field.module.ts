import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { PlayerModule } from 'src/game/player/player.module';
import { PlayerService } from 'src/game/player/player.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { CardModule } from 'src/game/card/card.module';
import { CardService } from 'src/game/card/card.service';
import { FieldService } from 'src/game/field/field.service';

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
    FieldService,
    {
      provide: 'PUBLISHER',
      useFactory: (redisService: RedisService) => {
        return redisService.getClient('publisher')
      },
      inject: [RedisService]
    },
  ],
  exports: [
    FieldService,
  ]
})
export class FieldModule {}
