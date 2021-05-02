import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { PlayerModule } from 'src/models/game/player/player.module';
import { PlayerService } from 'src/models/game/player/player.service';
import { UserModule } from 'src/models/user/user.module';
import { UserService } from 'src/models/user/user.service';
import { CardModule } from 'src/models/game/card/card.module';
import { CardService } from 'src/models/game/card/card.service';
import { FieldService } from 'src/models/game/field/field.service';

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
