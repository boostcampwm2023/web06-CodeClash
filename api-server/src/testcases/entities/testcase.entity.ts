import { BaseTable } from 'src/common/entities/base-table.entity';
import { ProblemTable } from 'src/problems/entities/problem.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'testcase' })
export class TestcaseTable extends BaseTable {
  @Column({ type: 'text' })
  input: string;

  @Column({ type: 'text' })
  output: string;

  @Column({ default: false })
  isExample: boolean;

  @ManyToOne(() => ProblemTable, (problem) => problem.testcases, {
    onDelete: 'CASCADE',
  })
  problem: ProblemTable;
}
