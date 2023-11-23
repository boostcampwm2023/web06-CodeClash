import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorators/user.decorator';
import { ScoreSubmissionDto } from './dto/score-submission.dto';

@Controller('v2/scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post('api/grade')
  @UseGuards(AccessTokenGuard)
  async grade(@Body() submission: ScoreSubmissionDto, @User() user) {
    return await this.scoresService.grade(submission, user);
  }
}
