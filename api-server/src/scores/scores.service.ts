import { BadRequestException, Injectable } from '@nestjs/common';
import { ScoreSubmissionDto } from './dto/score-submission.dto';
import { UserTable } from 'src/users/entities/user.entity';
import { ProblemsService } from 'src/problems/problems.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { CreateSubmissionDto } from 'src/submissions/dto/create-submission.dto';

const scoringServers = [
  'http://10.41.177.25:3000',
  'http://10.41.177.25:3001',
  'http://10.41.177.25:3002',
];
let currentServer = 0;

@Injectable()
export class ScoresService {
  constructor(
    private readonly problemsService: ProblemsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  async grade(submission: ScoreSubmissionDto, user: UserTable) {
    const { code, problemId, language } = submission;
    const problem = await this.problemsService.getProblem(problemId);

    if (!problem) {
      throw new BadRequestException('Problem does not exist');
    }

    const promises = [];

    for (let i = 0; i < problem.testcases.length; i++) {
      promises.push(
        fetch(`${scoringServers[currentServer]}/v2/scoring`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            language,
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit,
            testcase: problem.testcases[i],
          }),
        }),
      );
      currentServer = (currentServer + 1) % scoringServers.length;
    }

    let results = await Promise.all(promises);
    results = await Promise.all(results.map((result) => result.json()));
    const status = results.every((result) => result.status === 'pass')
      ? 'pass'
      : 'fail';

    await this.submissionsService.createSubmission({
      code,
      language,
      status,
      problemId,
      userId: user.id,
    } as CreateSubmissionDto);

    return results;
  }
}
