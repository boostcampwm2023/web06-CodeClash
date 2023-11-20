import { IsNumber } from 'class-validator';
import { BaseTable } from 'src/common/entities/base-table.entity';
import { ProblemTable } from 'src/problems/entities/problem.entity';
import { UserTable } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'submissions' })
export class SubmissionTable extends BaseTable {
  @Column()
  language: string;

  @Column({ type: 'text' })
  code: string;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'text', nullable: true })
  output: string;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column()
  @IsNumber()
  timeLimit: number;

  @Column()
  @IsNumber()
  memoryLimit: number;

  @ManyToOne(() => UserTable, (user) => user.submissions)
  user: UserTable;

  @ManyToOne(() => ProblemTable, (problem) => problem.submissions)
  problem: ProblemTable;
}
