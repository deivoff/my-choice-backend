import { Args, Mutation, Parent, Query, ResolveField, Resolver, Root, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Author, Message } from 'src/message/entities/message.entity';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DecodedUser, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Types } from 'mongoose';

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
      Types.ObjectId(decodedUser._id)
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
  ) {
    return this.pubSub.asyncIterator('onMessage');
  }

  @ResolveField(() => Author)
  async author(
    @Parent() { author }: Message,
  ): Promise<Author> {
    const user = await this.userService.findOne(author);
    return {
      _id: user._id,
      nickname: user.nickname,
      avatar: user.avatar
    };
  }

  @ResolveField(() => Date)
  createdAt(
    @Parent() { _id }: Message
  ) {
    return typeof _id === 'string' ? Types.ObjectId(_id).getTimestamp() : _id.getTimestamp()
  }

}
