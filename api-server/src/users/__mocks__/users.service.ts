import { NotFoundException } from '@nestjs/common';

export const UsersService = jest.fn().mockReturnValue({
  getUserByName: jest.fn((name) => {
    if (name == 'test') {
      return {
        name: 'test',
        email: 'test@test.test',
        acceptCount: 0,
        failCount: 0,
        winCount: 0,
        totalCount: 0,
      };
    } else {
      throw new NotFoundException('User not found');
    }
  }),
});
