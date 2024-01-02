import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from './submissions.service';
import { SubmissionsModule } from './submissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SubmissionLanguage,
  SubmissionStatus,
  SubmissionTable,
} from './entities/submission.entity';
import { ProblemTable } from 'src/problems/entities/problem.entity';
import { TestcaseTable } from 'src/testcases/entities/testcase.entity';
import { UserTable } from 'src/users/entities/user.entity';
import { ProblemsModule } from 'src/problems/problems.module';
import { UsersService } from 'src/users/users.service';
import { ProblemsService } from 'src/problems/problems.service';

describe('SubmissionsService', () => {
  let module: TestingModule;
  let service: SubmissionsService;
  let usersService: UsersService;
  let problemsService: ProblemsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        SubmissionsModule,
        ProblemsModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '5565',
          database: 'test',
          entities: [SubmissionTable, ProblemTable, TestcaseTable, UserTable],
          synchronize: true,
          dropSchema: true,
        }),
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
    usersService = module.get<UsersService>(UsersService);
    problemsService = module.get<ProblemsService>(ProblemsService);

    await usersService.create({
      name: 'name',
      email: 'email',
      password: 'password',
    });

    await problemsService.createProblem({
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

  it('create submission and get submission', async () => {
    const submission = await service.createSubmission({
      userId: 1,
      problemId: 1,
      code: 'code',
      status: SubmissionStatus.Accepted,
      language: SubmissionLanguage.JAVASCRIPT,
    });

    expect(submission.id).toEqual(1);
    const submissions = await service.getSubmissions();
    expect(submissions.length).toEqual(1);
    expect(submissions[0].id).toEqual(1);
  });

  it('get submission by userName', async () => {
    await service.createSubmission({
      userId: 1,
      problemId: 1,
      code: 'code',
      status: SubmissionStatus.Accepted,
      language: SubmissionLanguage.JAVASCRIPT,
    });

    const submission = await service.getSubmissionByUserName('name');
    expect(submission.id).toEqual(1);
  });

  it('get submission by userName and problemId', async () => {
    await service.createSubmission({
      userId: 1,
      problemId: 1,
      code: 'code',
      status: SubmissionStatus.Accepted,
      language: SubmissionLanguage.JAVASCRIPT,
    });

    const submission = await service.getLastSubmission('name', 1);
    expect(submission.id).toEqual(1);
  });

  it('get count of submissions by userId', async () => {
    await service.createSubmission({
      userId: 1,
      problemId: 1,
      code: 'code',
      status: SubmissionStatus.Accepted,
      language: SubmissionLanguage.JAVASCRIPT,
    });

    const count = await service.getCountOfSubmissionsByUserId(1);
    expect(count).toEqual(1);
  });
});
