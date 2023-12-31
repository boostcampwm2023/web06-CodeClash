import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SubmissionsService } from 'src/submissions/submissions.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Get('stats/:userName')
  async getUserStats(@Param('userName') userName: string) {
    if (!userName) throw new NotFoundException('userName must be provided');

    const user = await this.usersService.getUserByName(userName);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      name: user.name,
      email: user.email,
      acceptCount: user.acceptCount,
      failCount: user.failCount,
      winCount: user.winCount,
      totalCount: user.totalCount,
    };
  }

  @Get(':userName')
  async getUserInfo(
    @Param('userName') userName: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const user = await this.usersService.getUserByName(userName);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      name: user.name,
      email: user.email,
      acceptCount: user.acceptCount,
      failCount: user.failCount,
      winCount: user.winCount,
      totalCount: user.totalCount,
      submissions: await this.submissionsService.paginateSubmissionsByUserId(
        user.id,
        page ? parseInt(page) : 0,
        limit ? parseInt(limit) : 5,
      ),
      pageEnd: Math.floor(
        (await this.submissionsService.getCountOfSubmissionsByUserId(user.id)) /
          (limit ? parseInt(limit) : 5),
      ),
    };
  }
}
