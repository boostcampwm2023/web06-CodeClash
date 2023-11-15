import { Test, TestingModule } from '@nestjs/testing';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTable } from 'src/users/entities/user.entity';
import { UsersMockRepository } from 'src/users/mocks/repository.mock';

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
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersMockRepository,
        },
      ],
    }).compile();

    controller = module.get<ScoresController>(ScoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
