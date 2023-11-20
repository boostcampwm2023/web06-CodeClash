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

  async getTestcases(problemNumber: number) {
    return await this.testcasesRepository.find({
      where: { problem: { problemNumber: problemNumber } },
    });
  }

  async createTestcase(createTestcaseDto: CreateTestcaseDto) {
    return await this.testcasesRepository.save(createTestcaseDto);
  }

  async updateTestcase(
    problemNumber: number,
    testcaseId: number,
    updateTestcaseDto: UpdateTestcaseDto,
  ) {
    return await this.testcasesRepository.update(
      { problem: { problemNumber: problemNumber }, id: testcaseId },
      updateTestcaseDto,
    );
  }

  async deleteTestcase(problemNumber: number, testcaseId: number) {
    return await this.testcasesRepository.delete({
      problem: { problemNumber: problemNumber },
      id: testcaseId,
    });
  }
}
