import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from './submissions.service';
import { SubmissionTable } from './entities/submission.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubmissionsMockRepository } from './mocks/repository.mock';

describe('SubmissionsService', () => {
  let service: SubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        {
          provide: getRepositoryToken(SubmissionTable),
          useClass: SubmissionsMockRepository,
        },
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
