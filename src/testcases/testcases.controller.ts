import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TestcasesService } from './testcases.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { CreateTestcaseDto } from './dto/create-testcase.dto';
import { UpdateTestcaseDto } from './dto/update-testcase.dto';

@Controller('testcases')
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) {}
  @Get()
  @UseGuards(AccessTokenGuard)
  getTestcases(@Query('problemId', ParseIntPipe) problemId: number) {
    if (!problemId) {
      throw new BadRequestException('must provide problemId');
    }

    return this.testcasesService.getTestcases(problemId);
  }

  @Post('new')
  @UseGuards(AdminGuard)
  createTestcase(@Body() createTestcaseDto: CreateTestcaseDto) {
    return this.testcasesService.createTestcase(createTestcaseDto);
  }

  @Patch(':testcaseId/problems/:problemId')
  @UseGuards(AdminGuard)
  updateTestcase(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Param('testcaseId', ParseIntPipe) testcaseId: number,
    @Body() updateTestcaseDto: UpdateTestcaseDto,
  ) {
    return this.testcasesService.updateTestcase(
      problemId,
      testcaseId,
      updateTestcaseDto,
    );
  }

  @Delete(':testcaseId/problems/:problemId')
  @UseGuards(AdminGuard)
  deleteTestcase(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Param('testcaseId', ParseIntPipe) testcaseId: number,
  ) {
    return this.testcasesService.deleteTestcase(problemId, testcaseId);
  }
}
