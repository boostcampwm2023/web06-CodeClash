import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userName')
  async getUserInfo(@Param('userName') userName: string) {
    const user = await this.usersService.getUserByName(userName);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      name: user.name,
      email: user.email,
      submissions: user.submissions,
    };
  }
}
