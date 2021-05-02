import { Module } from '@nestjs/common';
import { GameService } from 'src/models/game/game.service';
import { GameResolver } from 'src/models/game/game.resolver';
import { TypegooseModule } from 'nestjs-typegoose';
import { Game } from 'src/models/game/game.entity';
import { UserModule } from 'src/models/user/user.module';
import { RedisService } from 'nestjs-redis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CardModule } from 'src/models/game/card/card.module';
import { GameSessionModule } from 'src/models/game/game-session/game-session.module';
import { GameSessionService } from 'src/models/game/game-session/game-session.service';
import { PlayerModule } from 'src/models/game/player/player.module';
import { PlayerService } from 'src/models/game/player/player.service';
import { UserService } from 'src/models/user/user.service';
import { FieldModule } from 'src/models/game/field/field.module';
import { GameController } from 'src/models/game/game.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([Game]),
    GameSessionModule,
    UserModule,
    PlayerModule,
    CardModule,
    FieldModule
  ],
  providers: [
    GameResolver,
    GameService,
    GameSessionService,
    UserService,
    PlayerService,
    {
      provide: 'PUBLISHER',
      useFactory: (redisService: RedisService) => {
        return redisService.getClient('publisher')
      },
      inject: [RedisService]
    },
    {
      provide: 'PUB_SUB',
      useFactory: (redisService: RedisService) => {
        return new RedisPubSub({
          publisher: redisService.getClient('publisher'),
          subscriber: redisService.getClient('subscriber'),
        })
      },
      inject: [RedisService]
    },
  ],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
