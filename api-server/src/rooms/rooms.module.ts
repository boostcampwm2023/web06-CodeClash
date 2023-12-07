import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProblemsModule } from 'src/problems/problems.module';
import { ScoresModule } from 'src/scores/scores.module';

@Module({
  providers: [RoomsGateway, RoomsService],
  imports: [AuthModule, UsersModule, ProblemsModule, ScoresModule],
})
export class RoomsModule {}
