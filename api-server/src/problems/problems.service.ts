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

  async findAllWithTestcases() {
    this.problemsRepository.find({
      relations: ['testcases'],
      where: { testcases: { isExample: true } },
      select: {
        id: true,
        title: true,
        description: true,
        timeLimit: true,
        memoryLimit: true,
        sampleCode: true,
        testcases: {
          input: true,
          output: true,
        },
      },
    });
  }

  async getProblemsAtRandom(caseCount: number) {
    const problems = await this.findAllWithTestcases();

    if (problems.length < caseCount) {
      throw new Error('caseCount must be lower than problem count');
    }

    const duplicated = new Set();

    while (duplicated.size < caseCount) {
      const randomIdx = Math.floor(Math.random() * problems.length);

      duplicated.add(randomIdx);
    }

    return [...duplicated].map((idx: number) => problems[idx]);
  }
}
