import { Injectable } from '@nestjs/common';
import { ScoreSubmissionDto } from './dto/score-submission.dto';
import { UserTable } from 'src/users/entities/user.entity';

const scoringServers = [
  'http://10.41.177.25:3000',
  'http://10.41.177.25:3001',
  'http://10.41.177.25:3002',
];
let currentServer = 0;

@Injectable()
export class ScoresService {
  async grade(submission: ScoreSubmissionDto, user: UserTable) {
    const { code } = submission;
    const { email } = user;

    const response = await fetch(
      `${scoringServers[currentServer]}/v2/scoring`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          testcase: {
            parameters: [10, 20],
            answer: 200,
          },
        }),
      },
    );

    currentServer = (currentServer + 1) % scoringServers.length;
    return response.json();
  }
}
