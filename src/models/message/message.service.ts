import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { Message } from './entities/message.entity';

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

  async ban(
    messageId: Types.ObjectId
  ) {
    return this.messageModel.findByIdAndUpdate(messageId, {
      banned: true
    })
  }

  async remove(
    messageId: Types.ObjectId
  ) {
    return this.messageModel.findByIdAndDelete(messageId)
  }

  findByTopic(topic: string, limit: number = 20, offset: number = 0) {
    return this.messageModel.find({
      topic,
      banned: { $exists: false },
    }, null, {
      sort: { $natural: -1 }
    }).skip(offset).limit(limit).lean();
  }
}
