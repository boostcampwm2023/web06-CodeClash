import { Test, TestingModule } from '@nestjs/testing';
import { TestcasesController } from './testcases.controller';
import { TestcasesService } from './testcases.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from 'src/auth/auth.controller';

jest.mock('./testcases.service');
jest.mock('src/users/users.service');

describe('TestcasesController', () => {
  let controller: TestcasesController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestcasesController, AuthController],
      providers: [TestcasesService, AuthService, UsersService, JwtService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<TestcasesController>(TestcasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all testcases', async () => {
    const testcases = await controller.getTestcases(null);

    expect(testcases).toEqual([
      {
        id: 1,
        problem: { id: 1 },
        input: '1\n2',
        output: '3',
      },
    ]);
  });

  it('should get testcases by problemId', async () => {
    const testcases = await controller.getTestcases(1);

    expect(testcases).toEqual([
      {
        id: 1,
        problem: { id: 1 },
        input: '1\n2',
        output: '3',
      },
    ]);
  });

  it('should get all testcases if problemId is not a number', async () => {
    await expect(await controller.getTestcases(null)).toEqual([
      {
        id: 1,
        problem: { id: 1 },
        input: '1\n2',
        output: '3',
      },
    ]);
  });

  it('should create a testcase', async () => {
    const testcase = await controller.createTestcase({
      problemId: 1,
      input: '1\n2',
      output: '3',
      isExample: false,
    });

    expect(testcase).toEqual({
      id: 1,
      problem: { id: 1 },
      input: '1\n2',
      output: '3',
      isExample: false,
    });
  });

  it('should update a testcase', async () => {
    const testcase = await controller.updateTestcase(1, {
      input: '1\n2',
      output: '3',
      isExample: false,
    });

    expect(testcase).toEqual({
      id: 1,
      input: '1\n2',
      output: '3',
      isExample: false,
    });
  });

  it('should delete a testcase', async () => {
    const testcase = await controller.deleteTestcase(1);

    expect(testcase).toEqual({
      id: 1,
    });
  });

  it('test 200 /api/testcases', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register/email')
      .send({
        email: 'test@test.com',
        password: 'test',
        name: 'test',
      })
      .expect(201);

    return request(app.getHttpServer())
      .get('/api/testcases')
      .set('authorization', `Bearer ${registerResponse.body.accessToken}`)
      .expect(200)
      .expect([
        {
          id: 1,
          problem: { id: 1 },
          input: '1\n2',
          output: '3',
        },
      ]);
  });

  it('test 200 new testcase', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register/email')
      .send({
        email: 'test@test.com',
        password: 'test',
        name: 'test',
      })
      .expect(201);

    return request(app.getHttpServer())
      .post('/api/testcases/new')
      .set('authorization', `Bearer ${registerResponse.body.accessToken}`)
      .send({
        problemId: 1,
        input: '1\n2',
        output: '3',
        isExample: false,
      })
      .expect(201)
      .expect({
        id: 1,
        problem: { id: 1 },
        input: '1\n2',
        output: '3',
        isExample: false,
      });
  });

  it('test 200 update testcase', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register/email')
      .send({
        email: 'test@test.com',
        password: 'test',
        name: 'test',
      })
      .expect(201);

    return request(app.getHttpServer())
      .patch('/api/testcases/1')
      .set('authorization', `Bearer ${registerResponse.body.accessToken}`)
      .send({
        input: '1\n2',
        output: '3',
        isExample: false,
      })
      .expect(200)
      .expect({
        id: 1,
        input: '1\n2',
        output: '3',
        isExample: false,
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
