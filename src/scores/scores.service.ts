import { Injectable } from '@nestjs/common';
import { ScoreSubmissionDto } from './dto/score-submission.dto';
import { UserTable } from 'src/users/entities/user.entity';

const SCORING_SERVER = 'http://10.41.177.25:3000';
@Injectable()
export class ScoresService {
  async grade(submission: ScoreSubmissionDto, user: UserTable) {
    const { code } = submission;
    const { email } = user;

    const response = await fetch(`${SCORING_SERVER}/v2/scoring`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        testcase: {
          parameters: [10, 20],
          answer: 200,
        },
      }),
    });

    return response.json();
  }
}
