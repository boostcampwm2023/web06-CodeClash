import { IsNumber } from 'class-validator';
import { BaseTable } from 'src/common/entities/base-table.entity';
import { SubmissionTable } from 'src/submissions/entities/submission.entity';
import { TestcaseTable } from 'src/testcases/entities/testcase.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'problem' })
export class ProblemTable extends BaseTable {
  @Column({ unique: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  @IsNumber()
  timeLimit: number;

  @Column()
  @IsNumber()
  memoryLimit: number;

  @Column({ type: 'text' })
  sampleCode: string;

  @OneToMany(() => TestcaseTable, (testcase) => testcase.problem, {
    cascade: true,
  })
  testcases: TestcaseTable[];

  @OneToMany(() => SubmissionTable, (submission) => submission.problem, {
    cascade: true,
  })
  submissions: SubmissionTable[];
}
