import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserTable } from './entities/user.entity';
import { UsersRepository } from './__mocks__/users.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = await service.create({
        name: 'chanwoo',
        email: 'chanwoo@chanwoo.com',
        password: 'chanwoo',
      });

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');

      expect(user.name).toBe('chanwoo');
      expect(user.email).toBe('chanwoo@chanwoo.com');
      expect(user.password).toBe('chanwoo');
    });

    it('should throw an error if user already exists', async () => {
      await expect(
        service.create({
          name: 'test',
          email: 'abcd@abcd.com',
          password: 'abcd',
        }),
      ).rejects.toThrow('이미 존재하는 이름입니다.');
    });

    it('should throw an error if email already exists', async () => {
      await expect(
        service.create({
          name: 'abcd',
          email: 'test@test.test',
          password: 'abcd',
        }),
      ).rejects.toThrow('이미 존재하는 이메일입니다.');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user', async () => {
      const user = await service.getUserByEmail('test@test.test');

      expect(user).toEqual({
        name: 'test',
        email: 'test@test.test',
        acceptCount: 0,
        failCount: 0,
        winCount: 0,
        totalCount: 0,
      });
    });
  });

  describe('getUserByName', () => {
    it('should return a user', async () => {
      const user = await service.getUserByName('test');

      expect(user).toEqual({
        name: 'test',
        email: 'test@test.test',
        acceptCount: 0,
        failCount: 0,
        winCount: 0,
        totalCount: 0,
      });
    });
  });

  describe('increaseAcceptCount', () => {
    it('should increase acceptCount', async () => {
      const user = await service.increaseAcceptCount('test');

      expect(user).toHaveProperty('acceptCount', 1);
    });
  });

  describe('increaseFailCount', () => {
    it('should increase failCount', async () => {
      const user = await service.increaseFailCount('test');

      expect(user).toHaveProperty('failCount', 1);
    });
  });

  describe('increaseWinCount', () => {
    it('should increase winCount', async () => {
      const user = await service.increaseWinCount('test');

      expect(user).toHaveProperty('winCount', 1);
    });
  });

  describe('increaseTotalCount', () => {
    it('should increase totalCount', async () => {
      const user = await service.increaseTotalCount('test');

      expect(user).toHaveProperty('totalCount', 1);
    });
  });
});
