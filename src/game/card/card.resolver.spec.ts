import { Test, TestingModule } from '@nestjs/testing';
import { CardResolver } from 'src/game/card/card.resolver';
import { CardService } from './game-field.service';

describe('GameFieldResolver', () => {
  let resolver: CardResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardResolver, CardService],
    }).compile();

    resolver = module.get<CardResolver>(CardResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
