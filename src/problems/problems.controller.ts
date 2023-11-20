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

  @Get(':problemNumber')
  @UseGuards(AccessTokenGuard)
  getProblem(@Param('problemNumber', ParseIntPipe) problemNumber: number) {
    return this.problemsService.getProblem(problemNumber);
  }

  @Post('new')
  @UseGuards(AdminGuard)
  createProblem(@Body() createProblemDto: CreateProblemDto) {
    return this.problemsService.createProblem(createProblemDto);
  }

  @Patch(':problemNumber')
  @UseGuards(AdminGuard)
  updateProblem(
    @Param('problemNumber', ParseIntPipe) problemNumber: number,
    @Body() updateProblemDto: CreateProblemDto,
  ) {
    return this.problemsService.updateProblem(problemNumber, updateProblemDto);
  }

  @Delete(':problemNumber')
  @UseGuards(AdminGuard)
  deleteProblem(@Param('problemNumber', ParseIntPipe) problemNumber: number) {
    return this.problemsService.deleteProblem(problemNumber);
  }
}
