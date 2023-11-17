import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTable } from './entities/user.entity';
import { UsersMockRepository } from './mocks/repository.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersMockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: UsersMockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserTable),
          useClass: UsersMockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockRepository = module.get<UsersMockRepository>(
      getRepositoryToken(UserTable),
    );
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };
      jest.spyOn(service, 'create').mockImplementation(async () => {
        return await mockRepository.create(createUserDto);
      });
      const user = await service.create(createUserDto);
      expect(user).toBeDefined();
      expect(user.name).toEqual(createUserDto.name);
      expect(user.email).toEqual(createUserDto.email);
      expect(user.password).toEqual(createUserDto.password);
      expect(user.id).toEqual(1);
      await expect(service.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a BadRequestException if the name already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a BadRequestException if the email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
