import { Test, TestingModule } from '@nestjs/testing';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTable } from 'src/users/entities/user.entity';
import { UsersMockRepository } from 'src/users/mocks/repository.mock';
import { AuthService } from 'src/auth/auth.service';
import { ProblemsService } from 'src/problems/problems.service';
import { ProblemTable } from 'src/problems/entities/problem.entity';
import { ProblemsMockRepository } from 'src/problems/mocks/repository.mock';
import { ScoresService } from 'src/scores/scores.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { SubmissionTable } from 'src/submissions/entities/submission.entity';
import { SubmissionsMockRepository } from 'src/submissions/mocks/repository.mock';

describe('RoomsGateway', () => {
  let gateway: RoomsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsGateway,
        RoomsService,
        UsersService,
        AuthService,
        JwtService,
        ProblemsService,
        ScoresService,
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

    gateway = module.get<RoomsGateway>(RoomsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
