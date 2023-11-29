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
      relations: ['testcases'],
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

  async getProblemIds() {
    const problems = await this.problemsRepository.find();

    return problems.map((problem) => problem.id);
  }

  async getProblemsAtRandom(caseCount: number) {
    const problems = await this.problemsRepository.find();

    if (problems.length < caseCount) {
      throw new Error('caseCount must be lower than problem count');
    }
    const duplicated = new Set();
    const results = [];

    for (let i = 0; i < caseCount; i++) {
      let randomIdx = Math.floor(Math.random() * problems.length);

      while (duplicated.has(randomIdx)) {
        randomIdx = Math.floor(Math.random() * problems.length);
      }

      duplicated.add(randomIdx);
      results.push(problems[randomIdx]);
    }

    return results;
  }
}
