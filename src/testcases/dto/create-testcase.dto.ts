import { PickType } from '@nestjs/mapped-types';
import { TestcaseTable } from '../entities/testcase.entity';

export class CreateTestcaseDto extends PickType(TestcaseTable, [
  'input',
  'output',
  'isExample',
]) {
  problemNumber: number;
}
