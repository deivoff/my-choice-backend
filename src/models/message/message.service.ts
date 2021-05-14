import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Message } from 'src/models/message/entities/message.entity';
import { UserName, UserPhoto } from 'src/models/user/entities/user.entity';
import { Types } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private readonly messageModel: ReturnModelType<typeof Message>,
  ) {}

  async create(
    topic: string,
    message: string,
    authorId: Types.ObjectId
  ) {
    return this.messageModel.create({
      message,
      author: authorId,
      topic,
    });
  }

  async remove(
    messageId: Types.ObjectId
  ) {
    return this.messageModel.findByIdAndDelete(messageId)
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
