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

  async getProblem(problemId: number) {
    return await this.problemsRepository.findOne({
      where: { id: problemId },
      relations: ['testcase'],
    });
  }

  async getAllProblems() {
    return await this.problemsRepository.find();
  }

  async createProblem(createProblemDto: CreateProblemDto) {
    return await this.problemsRepository.save(createProblemDto);
  }

  async updateProblem(problemId: number, updateProblemDto: CreateProblemDto) {
    return await this.problemsRepository.update(
      { id: problemId },
      updateProblemDto,
    );
  }

  async deleteProblem(problemId: number) {
    return await this.problemsRepository.delete({
      id: problemId,
    });
  }
}
