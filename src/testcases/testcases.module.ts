import { Module } from '@nestjs/common';
import { TestcasesService } from './testcases.service';
import { TestcasesController } from './testcases.controller';

@Module({
  controllers: [TestcasesController],
  providers: [TestcasesService],
})
export class TestcasesModule {}
