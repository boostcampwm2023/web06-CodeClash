import { PickType } from '@nestjs/mapped-types';
import { SubmissionTable } from '../entities/submission.entity';

export class CreateSubmissionDto extends PickType(SubmissionTable, [
  'code',
  'status',
  'language',
  'codeHash',
]) {
  problemId: number;
  userId: number;
}
