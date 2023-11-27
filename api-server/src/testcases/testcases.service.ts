import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestcaseTable } from './entities/testcase.entity';
import { Repository } from 'typeorm';
import { CreateTestcaseDto } from './dto/create-testcase.dto';
import { UpdateTestcaseDto } from './dto/update-testcase.dto';

@Injectable()
export class TestcasesService {
  constructor(
    @InjectRepository(TestcaseTable)
    private readonly testcasesRepository: Repository<TestcaseTable>,
  ) {}

  async getTestcases(problemId: number) {
    return await this.testcasesRepository.find({
      where: { problem: { id: problemId } },
    });
  }

  async getAllTestcases() {
    return await this.testcasesRepository.find();
  }

  async createTestcase(createTestcaseDto: CreateTestcaseDto) {
    return await this.testcasesRepository.save({
      ...createTestcaseDto,
      problem: { id: createTestcaseDto.problemId },
    });
  }

  async updateTestcase(
    testcaseId: number,
    updateTestcaseDto: UpdateTestcaseDto,
  ) {
    return await this.testcasesRepository.update(
      { id: testcaseId },
      updateTestcaseDto,
    );
  }

  async deleteTestcase(testcaseId: number) {
    return await this.testcasesRepository.delete({
      id: testcaseId,
    });
  }
}
