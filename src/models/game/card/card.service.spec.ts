import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from 'src/models/game/card/card.service';

describe('GameFieldService', () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardService],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
