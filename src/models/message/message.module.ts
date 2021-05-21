import { Module } from '@nestjs/common';
import { MessageService } from 'src/models/message/message.service';
import { MessageResolver } from 'src/models/message/message.resolver';
import { TypegooseModule } from 'nestjs-typegoose';
import { Message } from 'src/models/message/entities/message.entity';
import { UserModule } from 'src/models/user/user.module';
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
    },
  ],
})
export class MessageModule {}
