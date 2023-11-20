import { PickType } from '@nestjs/mapped-types';
import { ProblemTable } from '../entities/problem.entity';

export class CreateProblemDto extends PickType(ProblemTable, [
  'problemNumber',
  'title',
  'description',
  'timeLimit',
  'memoryLimit',
]) {}
