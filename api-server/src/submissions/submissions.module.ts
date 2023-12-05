import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionTable } from './entities/submission.entity';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  imports: [TypeOrmModule.forFeature([SubmissionTable])],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
