import { Test, TestingModule } from '@nestjs/testing';
import { ProblemsService } from './problems.service';
import { ProblemTable } from './entities/problem.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersMockRepository } from 'src/users/mocks/repository.mock';

describe('ProblemsService', () => {
  let service: ProblemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProblemsService,
        {
          provide: getRepositoryToken(ProblemTable),
          useClass: UsersMockRepository,
        },
      ],
    }).compile();

    service = module.get<ProblemsService>(ProblemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
