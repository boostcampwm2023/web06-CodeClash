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

  async createTestcase(createTestcaseDto: CreateTestcaseDto) {
    return await this.testcasesRepository.save(createTestcaseDto);
  }

  async updateTestcase(
    problemId: number,
    testcaseId: number,
    updateTestcaseDto: UpdateTestcaseDto,
  ) {
    return await this.testcasesRepository.update(
      { problem: { id: problemId }, id: testcaseId },
      updateTestcaseDto,
    );
  }

  async deleteTestcase(problemId: number, testcaseId: number) {
    return await this.testcasesRepository.delete({
      problem: { id: problemId },
      id: testcaseId,
    });
  }
}
