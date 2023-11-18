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
  getTestcases(@Query('problemNumber', ParseIntPipe) problemNumber: number) {
    if (!problemNumber) {
      throw new BadRequestException('must provide problemNumber');
    }

    return this.testcasesService.getTestcases(problemNumber);
  }

  @Post('new')
  @UseGuards(AdminGuard)
  createTestcase(@Body() createTestcaseDto: CreateTestcaseDto) {
    return this.testcasesService.createTestcase(createTestcaseDto);
  }

  @Patch(':testcaseId/problems/:problemNumber')
  @UseGuards(AdminGuard)
  updateTestcase(
    @Param('problemNumber', ParseIntPipe) problemNumber: number,
    @Param('testcaseId', ParseIntPipe) testcaseId: number,
    @Body() updateTestcaseDto: UpdateTestcaseDto,
  ) {
    return this.testcasesService.updateTestcase(
      problemNumber,
      testcaseId,
      updateTestcaseDto,
    );
  }

  @Delete(':testcaseId/problems/:problemNumber')
  @UseGuards(AdminGuard)
  deleteTestcase(
    @Param('problemNumber', ParseIntPipe) problemNumber: number,
    @Param('testcaseId', ParseIntPipe) testcaseId: number,
  ) {
    return this.testcasesService.deleteTestcase(problemNumber, testcaseId);
  }
}
