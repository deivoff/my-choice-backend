import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Message } from 'src/message/entities/message.entity';
import { UserName, UserPhoto } from 'src/user/entities/user.entity';
import { Types } from 'mongoose';
import { PubSubEngine } from 'graphql-subscriptions';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private readonly messageModel: ReturnModelType<typeof Message>,
    @Inject('PUB_SUB') private readonly pubSub: PubSubEngine,
  ) {}

  async createAndPublish(
    topic: string,
    message: string,
    user: {
      _id: Types.ObjectId,
      avatar?: UserPhoto,
      name: UserName,
    }
  ) {
    const newMessage = await this.messageModel.create({
      message,
      author: user._id,
      authorName: user.name,
      avatar: user.avatar,
      topic,
    });

    await this.pubSub.publish('onMessage', {
      onMessage: newMessage,
    });
  }

  findByTopic(topic: string) {
    return this.messageModel.find({
      topic,
    }, null, {
      limit: 20,
      sort: { $natural: -1 }
    });
  }
}
