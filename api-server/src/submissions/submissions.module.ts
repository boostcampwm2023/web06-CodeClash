import { Module, forwardRef } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionTable } from './entities/submission.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  imports: [
    TypeOrmModule.forFeature([SubmissionTable]),
    forwardRef(() => UsersModule),
  ],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
