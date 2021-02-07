import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { TypegooseModule } from 'nestjs-typegoose';
import { Message } from 'src/message/entities/message.entity';

@Module({
  imports: [TypegooseModule.forFeature([Message])],
  providers: [MessageResolver, MessageService]
})
export class MessageModule {}
