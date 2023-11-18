import { Test, TestingModule } from '@nestjs/testing';
import { TestcasesService } from './testcases.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestcasesMockRepository } from './mocks/repository.mock';
import { TestcaseTable } from './entities/testcase.entity';

describe('TestcasesService', () => {
  let service: TestcasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestcasesService,
        {
          provide: getRepositoryToken(TestcaseTable),
          useClass: TestcasesMockRepository,
        },
      ],
    }).compile();

    service = module.get<TestcasesService>(TestcasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
