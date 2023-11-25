import { PickType } from '@nestjs/mapped-types';
import { ProblemTable } from '../entities/problem.entity';

export class CreateProblemDto extends PickType(ProblemTable, [
  'title',
  'description',
  'timeLimit',
  'memoryLimit',
  'sampleCode',
]) {}
