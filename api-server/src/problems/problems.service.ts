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

  async findProblemsWithTestcases(limit: number) {
    const problems = await this.problemsRepository
      .createQueryBuilder('problem')
      .innerJoinAndSelect('problem.testcases', 'testcase')
      .orderBy('RAND()')
      .take(limit)
      .select([
        'problem.id',
        'problem.title',
        'problem.description',
        'problem.memoryLimit',
        'problem.timeLimit',
        'problem.sampleCode',
        'testcase',
      ])
      .getMany();

    return problems.map((problem) => {
      return {
        ...problem,
        testcases: problem.testcases.map((testcase) => {
          return {
            input: testcase.input,
            output: testcase.output,
          };
        }),
      };
    });
  }
}
