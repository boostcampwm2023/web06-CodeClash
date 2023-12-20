import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersService } from './users.service';
import { SubmissionsService } from 'src/submissions/submissions.service';

jest.mock('./users.service');
jest.mock('src/submissions/submissions.service');

describe('UsersController unit test', () => {
  let controller: UsersController;
  let app: INestApplication;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, SubmissionsService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    controller = module.get<UsersController>(UsersController);
    service = await module.resolve<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user stats', async () => {
    const result = {
      name: 'test',
      email: 'test@test.test',
      acceptCount: 0,
      failCount: 0,
      winCount: 0,
      totalCount: 0,
    };

    expect(await controller.getUserStats('test')).toEqual(result);
  });

  it('if user not found, should throw NotFoundException', async () => {
    await expect(controller.getUserStats('notfound')).rejects.toThrow(
      'User not found',
    );
  });

  it('test 200 /api/users/stats/:userName', async () => {
    return request(app.getHttpServer())
      .get('/api/users/stats/test')
      .expect(200)
      .expect({
        ...service.getUserByName('test'),
      });
  });

  it('test 404 /api/users/stats/:userName', async () => {
    return request(app.getHttpServer())
      .get('/api/users/stats/notfound')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
  });

  it('should return user info', async () => {
    const result = {
      name: 'test',
      email: 'test@test.test',
      acceptCount: 0,
      failCount: 0,
      winCount: 0,
      totalCount: 0,
      submissions: [],
      pageEnd: 0,
    };

    expect(await controller.getUserInfo('test', '0', '5')).toEqual(result);
  });

  it('if user not found, should throw NotFoundException', async () => {
    await expect(controller.getUserInfo('notfound', '0', '5')).rejects.toThrow(
      'User not found',
    );
  });

  it('test 200 /api/users/:userName', async () => {
    return request(app.getHttpServer())
      .get('/api/users/test')
      .expect(200)
      .expect({
        ...service.getUserByName('test'),
        submissions: [],
        pageEnd: 0,
      });
  });

  it('test 404 /api/users/:userName', async () => {
    return request(app.getHttpServer())
      .get('/api/users/notfound')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
