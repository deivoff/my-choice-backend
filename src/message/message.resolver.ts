import { Args, Mutation, Query, Resolver, Root, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from 'src/message/entities/message.entity';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DecodedUser } from 'src/user/entities/user.entity';

const pubSub = new PubSub();

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message], { name: 'messages'})
  findMessages(
    @Args('topic') topic: string
  ) {
    return this.messageService.getMessagesByTopic(topic)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async sendMessage(
    @Args('topic') topic: string,
    @Args('message') message: string,
    @DecodedUser() decodedUser: DecodedUser,
  ) {
    const newMessage = await this.messageService.addMessage(
      topic,
      message,
      {
        _id: decodedUser._id,
        name: decodedUser.name,
        avatar: decodedUser.photos[0],
      }
    );

    await pubSub.publish('onMessage', {
      onMessage: newMessage,
    });

    return true;
  }

  @Subscription(() => Message, {
    filter: (payload, variables) =>
      payload.onMessage.topic === variables.topic,
  })
  onMessage(
    @Args('topic') topic: string,
    @Root() message: Message,
  ) {
    return pubSub.asyncIterator('onMessage');
  }
}
