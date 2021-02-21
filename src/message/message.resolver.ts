import { Args, Mutation, Parent, Query, ResolveField, Resolver, Root, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from 'src/message/entities/message.entity';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DecodedUser, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSubEngine,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [Message], { name: 'messages'})
  findMessages(
    @Args('topic') topic: string
  ) {
    return this.messageService.findByTopic(topic)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async sendMessage(
    @Args('topic') topic: string,
    @Args('message') message: string,
    @DecodedUser() decodedUser: DecodedUser,
  ) {
    const newMessage = await this.messageService.create(
      topic,
      message,
      decodedUser._id
    );

    await this.pubSub.publish('onMessage', {
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
    return this.pubSub.asyncIterator('onMessage');
  }

  @ResolveField(() => User)
  author(
    @Parent() { author }: Message,
  ) {
    return this.userService.findOne(author);
  }
}
