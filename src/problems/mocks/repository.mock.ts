import { CreateProblemDto } from '../dto/create-problem.dto';

export class ProblemsMockRepository {
  problems = [];
  async findOne() {
    return {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'title',
      description: 'description',
      input: 'input',
      output: 'output',
    };
  }

  async create(createProblemDto: CreateProblemDto) {
    const problem = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: createProblemDto.title,
      description: createProblemDto.description,
      timeLimit: createProblemDto.timeLimit,
      memoryLimit: createProblemDto.memoryLimit,
    };
    return problem;
  }
  async save(problem) {
    this.problems.push(problem);
    return problem;
  }
  async exist(createProblemDto) {
    const problem = this.problems.find(
      (problem) => problem.title === createProblemDto.title,
    );
    return problem ? true : false;
  }
}
