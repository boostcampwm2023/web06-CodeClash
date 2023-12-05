import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserTable } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersMockRepository } from './mocks/repository.mock';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { SubmissionsMockRepository } from 'src/submissions/mocks/repository.mock';
import { SubmissionTable } from 'src/submissions/entities/submission.entity';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        SubmissionsService,
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersMockRepository,
        },
        {
          provide: getRepositoryToken(SubmissionTable),
          useClass: SubmissionsMockRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
