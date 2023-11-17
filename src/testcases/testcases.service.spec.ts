import { Test, TestingModule } from '@nestjs/testing';
import { TestcasesService } from './testcases.service';

describe('TestcasesService', () => {
  let service: TestcasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestcasesService],
    }).compile();

    service = module.get<TestcasesService>(TestcasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
