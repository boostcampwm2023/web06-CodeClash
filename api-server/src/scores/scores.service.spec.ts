import { Test, TestingModule } from '@nestjs/testing';
import { ScoresService } from './scores.service';
import { ProblemsService } from 'src/problems/problems.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProblemTable } from 'src/problems/entities/problem.entity';
import { ProblemsMockRepository } from 'src/problems/mocks/repository.mock';
import { SubmissionTable } from 'src/submissions/entities/submission.entity';
import { SubmissionsMockRepository } from 'src/submissions/mocks/repository.mock';

describe('ScoresService', () => {
  let service: ScoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        ProblemsService,
        SubmissionsService,
        {
          provide: getRepositoryToken(ProblemTable),
          useClass: ProblemsMockRepository,
        },
        {
          provide: getRepositoryToken(SubmissionTable),
          useClass: SubmissionsMockRepository,
        },
      ],
    }).compile();

    service = module.get<ScoresService>(ScoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
