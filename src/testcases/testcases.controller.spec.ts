import { Test, TestingModule } from '@nestjs/testing';
import { TestcasesController } from './testcases.controller';
import { TestcasesService } from './testcases.service';

describe('TestcasesController', () => {
  let controller: TestcasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestcasesController],
      providers: [TestcasesService],
    }).compile();

    controller = module.get<TestcasesController>(TestcasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
