import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubmissionTable } from './entities/submission.entity';
import { SubmissionsMockRepository } from './mocks/repository.mock';
import { UserTable } from 'src/users/entities/user.entity';
import { UsersMockRepository } from 'src/users/mocks/repository.mock';
import { UsersService } from 'src/users/users.service';

describe('SubmissionsController', () => {
  let controller: SubmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionsController],
      providers: [
        SubmissionsService,
        AuthModule,
        JwtModule,
        UsersService,
        {
          provide: getRepositoryToken(SubmissionTable),
          useClass: SubmissionsMockRepository,
        },
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersMockRepository,
        },
      ],
    }).compile();

    controller = module.get<SubmissionsController>(SubmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
