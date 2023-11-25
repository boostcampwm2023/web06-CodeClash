import { Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemTable } from './entities/problem.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProblemsController],
  providers: [ProblemsService],
  imports: [TypeOrmModule.forFeature([ProblemTable]), AuthModule, UsersModule],
  exports: [ProblemsService],
})
export class ProblemsModule {}
