import { Resolver, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from 'src/message/entities/message.entity';

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

@Subscription(() => Message)
  messageAdded() {

  }
}
