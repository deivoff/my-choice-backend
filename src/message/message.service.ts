import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Message } from 'src/message/entities/message.entity';
import { UserName, UserPhoto } from 'src/user/entities/user.entity';
import { Types } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private readonly messageModel: ReturnModelType<typeof Message>
  ) {}

  addMessage(
    topic: string,
    message: string,
    user: {
      _id: Types.ObjectId,
      avatar?: UserPhoto,
      name: UserName,
    }
  ) {
    return this.messageModel.create({
      message,
      author: user._id,
      authorName: user.name,
      avatar: user.avatar,
      topic,
    })
  }

  getMessagesByTopic(topic: string) {
    return this.messageModel.find({
      topic,
    }, null, {
      limit: 20,
      sort: { $natural: -1 }
    });
  }
}
