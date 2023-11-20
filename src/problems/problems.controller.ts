import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateProblemDto } from './dto/create-problem.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get(':problemId')
  @UseGuards(AccessTokenGuard)
  getProblem(@Param('problemId', ParseIntPipe) problemId: number) {
    return this.problemsService.getProblem(problemId);
  }

  @Post('new')
  @UseGuards(AdminGuard)
  createProblem(@Body() createProblemDto: CreateProblemDto) {
    return this.problemsService.createProblem(createProblemDto);
  }

  @Patch(':problemId')
  @UseGuards(AdminGuard)
  updateProblem(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Body() updateProblemDto: CreateProblemDto,
  ) {
    return this.problemsService.updateProblem(problemId, updateProblemDto);
  }

  @Delete(':problemId')
  @UseGuards(AdminGuard)
  deleteProblem(@Param('problemId', ParseIntPipe) problemId: number) {
    return this.problemsService.deleteProblem(problemId);
  }
}
