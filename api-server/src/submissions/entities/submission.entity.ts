import { BaseTable } from 'src/common/entities/base-table.entity';
import { ProblemTable } from 'src/problems/entities/problem.entity';
import { UserTable } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

export enum SubmissionStatus {
  Accepted = 'Accepted',
  WrongAnswer = 'Wrong Answer',
  TimeLimitExceeded = 'Time Limit Exceeded',
  MemoryLimitExceeded = 'Memory Limit Exceeded',
  RuntimeError = 'Runtime Error',
  CompileError = 'Compile Error',
  InternalError = 'Internal Error',
}

@Entity({ name: 'submission' })
export class SubmissionTable extends BaseTable {
  @Column()
  language: string;

  @Column({ type: 'text' })
  code: string;

  @Column({ type: 'enum', enum: SubmissionStatus })
  status: SubmissionStatus;

  @Column({ type: 'text' })
  @Index()
  codeHash: string;

  @ManyToOne(() => UserTable, (user) => user.submissions)
  user: UserTable;

  @ManyToOne(() => ProblemTable, (problem) => problem.submissions)
  problem: ProblemTable;
}
