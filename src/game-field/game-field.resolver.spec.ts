import { Test, TestingModule } from '@nestjs/testing';
import { GameFieldResolver } from './game-field.resolver';
import { GameFieldService } from './game-field.service';

describe('GameFieldResolver', () => {
  let resolver: GameFieldResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameFieldResolver, GameFieldService],
    }).compile();

    resolver = module.get<GameFieldResolver>(GameFieldResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
