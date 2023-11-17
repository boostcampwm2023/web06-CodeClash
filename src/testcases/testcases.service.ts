import { Injectable } from '@nestjs/common';
import { CreateTestcaseDto } from './dto/create-testcase.dto';
import { UpdateTestcaseDto } from './dto/update-testcase.dto';

@Injectable()
export class TestcasesService {
  create(createTestcaseDto: CreateTestcaseDto) {
    return 'This action adds a new testcase';
  }

  findAll() {
    return `This action returns all testcases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testcase`;
  }

  update(id: number, updateTestcaseDto: UpdateTestcaseDto) {
    return `This action updates a #${id} testcase`;
  }

  remove(id: number) {
    return `This action removes a #${id} testcase`;
  }
}
