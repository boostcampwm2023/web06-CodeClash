import { IsNumber } from 'class-validator';
import { BaseTable } from 'src/common/entities/base-table.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'problems' })
export class ProblemTable extends BaseTable {
  @Column({ unique: true })
  @IsNumber()
  problemNumber: number;

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
}
