import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTable } from './entities/user.entity';
import { SubmissionsModule } from 'src/submissions/submissions.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserTable]),
    forwardRef(() => SubmissionsModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
