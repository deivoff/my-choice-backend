import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { TypegooseModule } from 'nestjs-typegoose';
import { Game } from 'src/game/game.entity';
import { UserModule } from 'src/user/user.module';
import { RedisService } from 'nestjs-redis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CardModule } from 'src/game/card/card.module';
import { GameSessionModule } from 'src/game/game-session/game-session.module';
import { GameSessionService } from 'src/game/game-session/game-session.service';
import { PlayerModule } from 'src/game/player/player.module';
import { PlayerService } from 'src/game/player/player.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypegooseModule.forFeature([Game]),
    GameSessionModule,
    UserModule,
    PlayerModule,
    CardModule,
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
})
export class GameModule {}
