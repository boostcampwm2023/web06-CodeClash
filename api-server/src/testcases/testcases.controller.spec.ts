import { Test, TestingModule } from '@nestjs/testing';
import { TestcasesController } from './testcases.controller';
import { TestcasesService } from './testcases.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestcasesMockRepository } from './mocks/repository.mock';
import { TestcaseTable } from './entities/testcase.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersMockRepository } from 'src/users/mocks/repository.mock';
import { UserTable } from 'src/users/entities/user.entity';

describe('TestcasesController', () => {
  let controller: TestcasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestcasesController],
      providers: [
        TestcasesService,
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(TestcaseTable),
          useClass: TestcasesMockRepository,
        },
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersMockRepository,
        },
      ],
    }).compile();

    controller = module.get<TestcasesController>(TestcasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
