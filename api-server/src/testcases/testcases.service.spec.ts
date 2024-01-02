import { Test, TestingModule } from '@nestjs/testing';
import { TestcasesService } from './testcases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestcaseTable } from './entities/testcase.entity';
import { TestcasesModule } from './testcases.module';
import { ProblemTable } from 'src/problems/entities/problem.entity';
import { SubmissionTable } from 'src/submissions/entities/submission.entity';
import { UserTable } from 'src/users/entities/user.entity';
import { ProblemsService } from 'src/problems/problems.service';
import { ProblemsModule } from 'src/problems/problems.module';

describe('TestcasesService', () => {
  let module: TestingModule;
  let service: TestcasesService;
  let problemService: ProblemsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TestcasesModule,
        ProblemsModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '5565',
          database: 'test',
          entities: [TestcaseTable, ProblemTable, SubmissionTable, UserTable],
          synchronize: true,
          dropSchema: true,
        }),
      ],
    }).compile();

    service = module.get<TestcasesService>(TestcasesService);
    problemService = module.get<ProblemsService>(ProblemsService);

    await problemService.createProblem({
      title: 'title',
      description: 'description',
      memoryLimit: 1,
      timeLimit: 1,
      sampleCode: 'sampleCode',
    });
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create testcase and get testcase', async () => {
    const testcase = await service.createTestcase({
      problemId: 1,
      input: 'input',
      output: 'output',
      isExample: true,
    });
    expect(testcase.id).toEqual(1);
    const testcases = await service.getTestcases(1);
    expect(testcases.length).toEqual(1);
    expect(testcases[0].id).toEqual(1);
  });

  it('update testcase', async () => {
    await service.createTestcase({
      problemId: 1,
      input: 'input',
      output: 'output',
      isExample: true,
    });
    await service.updateTestcase(1, {
      input: 'input2',
      output: 'output2',
      isExample: false,
    });
    const testcase = await service.getTestcases(1);
    expect(testcase[0].input).toEqual('input2');
    expect(testcase[0].output).toEqual('output2');
    expect(testcase[0].isExample).toEqual(false);
  });

  it('delete testcase', async () => {
    await service.createTestcase({
      problemId: 1,
      input: 'input',
      output: 'output',
      isExample: true,
    });
    await service.deleteTestcase(1);
    const testcase = await service.getTestcases(1);
    expect(testcase.length).toEqual(0);
  });

  it('get all testcases', async () => {
    await service.createTestcase({
      problemId: 1,
      input: 'input',
      output: 'output',
      isExample: true,
    });
    await service.createTestcase({
      problemId: 1,
      input: 'input2',
      output: 'output2',
      isExample: false,
    });
    const testcases = await service.getAllTestcases();
    expect(testcases.length).toEqual(2);
  });
});
