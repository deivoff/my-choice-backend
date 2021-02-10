import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { TypegooseModule } from 'nestjs-typegoose';
import { Message } from 'src/message/entities/message.entity';
import { UserModule } from 'src/user/user.module';
import { RedisModule, RedisService } from 'nestjs-redis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Module({
  imports: [TypegooseModule.forFeature([Message]), UserModule, RedisModule],
  providers: [
    MessageResolver,
    MessageService,
    {
      provide: 'PUB_SUB',
      useFactory: (redisService: RedisService) => {
        return new RedisPubSub({
          publisher: redisService.getClient('publisher'),
          subscriber: redisService.getClient('subscriber'),
        })
      },
      inject: [RedisService]
    }
  ],
})
export class MessageModule {}
