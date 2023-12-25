import { Test, TestingModule } from '@nestjs/testing';
import { TestcasesController } from './testcases.controller';
import { TestcasesService } from './testcases.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('./testcases.service');
jest.mock('src/auth/auth.service');
jest.mock('src/users/users.service');

describe('TestcasesController', () => {
  let controller: TestcasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestcasesController],
      providers: [TestcasesService, AuthService, UsersService, JwtService],
    }).compile();

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
});
