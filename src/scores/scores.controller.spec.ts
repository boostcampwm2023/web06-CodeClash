import { Test, TestingModule } from '@nestjs/testing';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';

describe('ScoresController', () => {
  let controller: ScoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoresController],
      providers: [ScoresService],
    }).compile();

    controller = module.get<ScoresController>(ScoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
