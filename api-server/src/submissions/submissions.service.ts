import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmissionTable } from './entities/submission.entity';
import { Repository } from 'typeorm';
import { CreateSubmissionDto } from './dto/create-submission.dto';

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

  async createSubmission(createSubmissionDto: CreateSubmissionDto) {
    const submission = this.submissionsRepository.create(createSubmissionDto);
    return await this.submissionsRepository.save({
      ...submission,
      user: { id: createSubmissionDto.userId },
      problem: { id: createSubmissionDto.problemId },
    });
  }
}
