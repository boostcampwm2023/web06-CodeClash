import { SubmissionTable } from '../entities/submission.entity';

export class SubmissionsMockRepository {
  submissions = [];

  public async findOne(): Promise<SubmissionTable | undefined> {
    return new SubmissionTable();
  }

  public async find(): Promise<SubmissionTable[]> {
    return this.submissions;
  }
}
