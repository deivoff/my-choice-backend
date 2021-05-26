import {
  Args, Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PubSubEngine } from 'graphql-subscriptions';

import { MessageService } from './message.service';
import { Author, Message } from './entities/message.entity';
import { AuthGuard } from 'src/models/auth/auth.guard';
import { DecodedUser, User } from 'src/models/user/entities/user.entity';
import { UserService } from 'src/models/user/user.service';
import { Types } from 'mongoose';
import { USER_NOT_FOUND } from 'src/models/user/user.errors';
import { ChatEvent, ChatPubSubPayload } from 'src/models/message/dto/chat-event.dto';
import { Loader } from 'src/dataloader';
import { UserLoader } from 'src/models/user/user.loader';
import { MESSAGE_NOT_FOUND } from './message.errors';


@Resolver(() => Message)
export class MessageResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSubEngine,
    private readonly messageService: MessageService,
  ) {}

  @Query(() => [Message], { name: 'messages'})
  findMessages(
    @Args('topic') topic: string,
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
    @Args('offset', { nullable: true, type: () => Int  }) offset?: number,
  ) {
    return this.messageService.findByTopic(topic, limit, offset)
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

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteMessage(
    @Args('messageId') messageId: Types.ObjectId,
    @DecodedUser() decodedUser: DecodedUser,
  ) {
    const message = await this.messageService.ban(messageId);

    if (!message) {
      throw new Error(MESSAGE_NOT_FOUND)
    }
    await this.pubSub.publish('onMessage', {
      onMessage: {
        _id: messageId,
        topic: message.topic,
      },
    });

    return true;
  }

  @Subscription(() => ChatEvent, {
    filter: (payload: ChatPubSubPayload, variables) =>
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
    @Loader(UserLoader) userLoader: DataLoader<User['_id'], User>,
  ): Promise<Author> {
    const user = await userLoader.load(author);

    if (!user) {
      throw new Error(USER_NOT_FOUND)
    }

    return {
      _id: user._id,
      nickname: user.nickname,
      avatar: user?.avatar ?? undefined
    };
  }

  @ResolveField(() => Date)
  createdAt(
    @Parent() { _id }: Message
  ) {
    return typeof _id === 'string' ? Types.ObjectId(_id).getTimestamp() : _id.getTimestamp()
  }

}
