import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProblemsModule } from 'src/problems/problems.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';

@Module({
  controllers: [ScoresController],
  providers: [ScoresService],
  imports: [AuthModule, UsersModule, ProblemsModule, SubmissionsModule],
})
export class ScoresModule {}
