import { Module } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { GameSessionService } from 'src/models/game/game-session/game-session.service';
import { PlayerModule } from 'src/models/game/player/player.module';
import { PlayerService } from 'src/models/game/player/player.service';
import { GameSessionResolver } from 'src/models/game/game-session/game-session.resolver';
import { UserModule } from 'src/models/user/user.module';
import { UserService } from 'src/models/user/user.service';
import { CardModule } from 'src/models/game/card/card.module';
import { CardService } from 'src/models/game/card/card.service';
import { FieldModule } from 'src/models/game/field/field.module';
import { FieldService } from 'src/models/game/field/field.service';

@Module({
  imports: [
    PlayerModule,
    UserModule,
    CardModule,
    FieldModule,
  ],
  providers: [
    PlayerService,
    UserService,
    CardService,
    FieldService,
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
