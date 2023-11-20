import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmissionTable } from './entities/submission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(SubmissionTable)
    private readonly submissionsRepository: Repository<SubmissionTable>,
  ) {}

  async getSubmissions() {
    return await this.submissionsRepository.find();
  }

  async getSubmissionByUserName(userName: string) {
    return await this.submissionsRepository.findOne({
      where: { user: { name: userName } },
    });
  }
}
