import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoresModule } from './scores/scores.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserTable } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { ProblemTable } from './problems/entities/problem.entity';
import { TestcasesModule } from './testcases/testcases.module';
import { TestcaseTable } from './testcases/entities/testcase.entity';
import { SubmissionsModule } from './submissions/submissions.module';
import { SubmissionTable } from './submissions/entities/submission.entity';
import { RoomsModule } from './rooms/rooms.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      entities: [UserTable, ProblemTable, TestcaseTable, SubmissionTable],
      namingStrategy: new SnakeNamingStrategy(),
      charset: 'utf8mb4',
    }),
    ScoresModule,
    UsersModule,
    AuthModule,
    ProblemsModule,
    TestcasesModule,
    SubmissionsModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
