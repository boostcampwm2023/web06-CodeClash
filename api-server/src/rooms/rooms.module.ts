import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProblemsModule } from 'src/problems/problems.module';
import { ScoresModule } from 'src/scores/scores.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';

@Module({
  providers: [RoomsGateway, RoomsService],
  imports: [
    AuthModule,
    UsersModule,
    ProblemsModule,
    ScoresModule,
    SubmissionsModule,
  ],
})
export class RoomsModule {}
