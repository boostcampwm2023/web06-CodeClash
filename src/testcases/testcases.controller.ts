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

@Controller('api/testcases')
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) {}
  @Get()
  @UseGuards(AccessTokenGuard)
  getTestcases(@Query('problemId') problemId: number) {
    if (!problemId) {
      return this.testcasesService.getAllTestcases();
    } else {
      if (isNaN(problemId)) {
        throw new BadRequestException('problemId must be a number');
      }

      return this.testcasesService.getTestcases(problemId);
    }
  }

  @Post('new')
  @UseGuards(AdminGuard)
  createTestcase(@Body() createTestcaseDto: CreateTestcaseDto) {
    return this.testcasesService.createTestcase(createTestcaseDto);
  }

  @Patch(':testcaseId')
  @UseGuards(AdminGuard)
  updateTestcase(
    @Param('testcaseId', ParseIntPipe) testcaseId: number,
    @Body() updateTestcaseDto: UpdateTestcaseDto,
  ) {
    return this.testcasesService.updateTestcase(testcaseId, updateTestcaseDto);
  }

  @Delete(':testcaseId')
  @UseGuards(AdminGuard)
  deleteTestcase(@Param('testcaseId', ParseIntPipe) testcaseId: number) {
    return this.testcasesService.deleteTestcase(testcaseId);
  }
}
