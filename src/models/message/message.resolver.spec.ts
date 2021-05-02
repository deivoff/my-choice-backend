import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from 'src/models/message/message.resolver';
import { MessageService } from 'src/models/message/message.service';

describe('MessageResolver', () => {
  let resolver: MessageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageResolver, MessageService],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
