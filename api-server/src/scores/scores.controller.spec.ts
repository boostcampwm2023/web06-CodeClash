import { Test, TestingModule } from '@nestjs/testing';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTable } from 'src/users/entities/user.entity';
import { UsersMockRepository } from 'src/users/mocks/repository.mock';
import { ProblemsService } from 'src/problems/problems.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { ProblemTable } from 'src/problems/entities/problem.entity';
import { ProblemsMockRepository } from 'src/problems/mocks/repository.mock';
import { SubmissionTable } from 'src/submissions/entities/submission.entity';
import { SubmissionsMockRepository } from 'src/submissions/mocks/repository.mock';

describe('ScoresController', () => {
  let controller: ScoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoresController],
      providers: [
        ScoresService,
        AuthService,
        UsersService,
        JwtService,
        ProblemsService,
        SubmissionsService,
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersMockRepository,
        },
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

    controller = module.get<ScoresController>(ScoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
