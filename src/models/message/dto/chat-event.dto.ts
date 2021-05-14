import { createUnionType, ObjectType, PickType } from '@nestjs/graphql';
import { Message } from 'src/models/message/entities/message.entity';

@ObjectType()
class RemoveMessage extends PickType(Message, ['_id']){}

export const ChatEvent = createUnionType({
  name: 'ChatEvent',
  types: () => [Message, RemoveMessage],
  resolveType: (value) => {
    if (value?.message) {
      return Message;
    }

    return RemoveMessage;
  }
});

export type ChatPubSubPayload = {
  onMessage: {
    topic: string,
    payload: Message | RemoveMessage;
  }
}
