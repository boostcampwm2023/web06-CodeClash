import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblemTable } from './entities/problem.entity';
import { CreateProblemDto } from './dto/create-problem.dto';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(ProblemTable)
    private readonly problemsRepository: Repository<ProblemTable>,
  ) {}

  async getProblem(problemNumber: number) {
    return await this.problemsRepository.findOne({
      where: { problemNumber: problemNumber },
      relations: ['testcases'],
    });
  }

  async createProblem(createProblemDto: CreateProblemDto) {
    return await this.problemsRepository.save(createProblemDto);
  }

  async updateProblem(
    problemNumber: number,
    updateProblemDto: CreateProblemDto,
  ) {
    return await this.problemsRepository.update(
      { problemNumber: problemNumber },
      updateProblemDto,
    );
  }

  async deleteProblem(problemNumber: number) {
    return await this.problemsRepository.delete({
      problemNumber: problemNumber,
    });
  }
}
