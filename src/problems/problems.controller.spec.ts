import { Test, TestingModule } from '@nestjs/testing';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTable } from 'src/users/entities/user.entity';
import { UsersMockRepository } from 'src/users/mocks/repository.mock';
import { ProblemTable } from './entities/problem.entity';
import { JwtService } from '@nestjs/jwt';

describe('ProblemsController', () => {
  let controller: ProblemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblemsController],
      providers: [
        ProblemsService,
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersMockRepository,
        },
        {
          provide: getRepositoryToken(ProblemTable),
          useClass: UsersMockRepository,
        },
      ],
    }).compile();

    controller = module.get<ProblemsController>(ProblemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
