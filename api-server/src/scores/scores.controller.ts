import {
  Body,
  Controller,
  HttpCode,
  ParseBoolPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorators/user.decorator';
import { ScoreSubmissionDto } from './dto/score-submission.dto';

@Controller('api/scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post('grade')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  async grade(
    @Body() submission: ScoreSubmissionDto,
    @Query('isExample', ParseBoolPipe) isExample: boolean,
    @User() user,
  ) {
    return await this.scoresService.grade(
      submission,
      user,
      isExample ? true : false,
    );
  }
}
