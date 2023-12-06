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

  async isExist(hashedCode: string) {
    return await this.submissionsRepository.findOne({
      where: { codeHash: hashedCode },
    });
  }

  async paginateSubmissionsByUserId(
    userId: number,
    page: number,
    limit: number = 5,
  ) {
    return await this.submissionsRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.problem', 'problem')
      .where('submission.user_id = :userId', { userId })
      .skip(page * limit)
      .take(limit)
      .orderBy('submission.id', 'DESC')
      .select([
        'submission.id',
        'submission.language',
        'submission.code',
        'submission.codeHash',
        'submission.status',
        'submission.createdAt',
        'problem.id',
        'problem.title',
      ])
      .getMany();
  }

  async getCountOfSubmissionsByUserId(userId: number) {
    return await this.submissionsRepository.count({
      where: { user: { id: userId } },
    });
  }

  async getLastSubmission(userName: string, problemId: number) {
    return await this.submissionsRepository.findOne({
      where: { user: { name: userName }, problem: { id: problemId } },
      order: { id: 'DESC' },
    });
  }
}
