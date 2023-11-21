import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionTable } from './entities/submission.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  imports: [
    TypeOrmModule.forFeature([SubmissionTable]),
    AuthModule,
    UsersModule,
  ],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
