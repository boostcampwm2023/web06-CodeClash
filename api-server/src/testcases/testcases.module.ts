import { Module } from '@nestjs/common';
import { TestcasesService } from './testcases.service';
import { TestcasesController } from './testcases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestcaseTable } from './entities/testcase.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TestcasesController],
  providers: [TestcasesService],
  imports: [TypeOrmModule.forFeature([TestcaseTable]), AuthModule, UsersModule],
})
export class TestcasesModule {}
