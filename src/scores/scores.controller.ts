import { Body, Controller, Post } from '@nestjs/common';
import { ScoresService } from './scores.service';

interface IUserSubmission {
  code: string;
  language: string;
  problemNumber: number;
}

@Controller('v2/scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post('/grade')
  async grade(@Body() submission: IUserSubmission) {
    const { code, language, problemNumber } = submission;

    return await this.scoresService.grade(code, language, problemNumber);
  }
}
