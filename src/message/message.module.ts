import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { TypegooseModule } from 'nestjs-typegoose';
import { Message } from 'src/message/entities/message.entity';
import { PubSub } from 'graphql-subscriptions';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypegooseModule.forFeature([Message]), UserModule],
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
    MessageResolver,
    MessageService
  ],
})
export class MessageModule {}
