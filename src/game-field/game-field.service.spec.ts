import { Test, TestingModule } from '@nestjs/testing';
import { GameFieldService } from './game-field.service';

describe('GameFieldService', () => {
  let service: GameFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameFieldService],
    }).compile();

    service = module.get<GameFieldService>(GameFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
