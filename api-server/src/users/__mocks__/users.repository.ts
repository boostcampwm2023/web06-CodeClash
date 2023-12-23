import { CreateUserDto } from '../dto/create-user.dto';

export const UsersRepository = jest.fn().mockReturnValue({
  findOne: jest.fn((options) => {
    const { name, email } = options.where;

    if (name == 'test' || email == 'test@test.test') {
      return Promise.resolve({
        name: 'test',
        email: 'test@test.test',
        acceptCount: 0,
        failCount: 0,
        winCount: 0,
        totalCount: 0,
      });
    }
  }),

  create: jest.fn((dto: CreateUserDto) => {
    return {
      acceptCount: 0,
      failCount: 0,
      winCount: 0,
      totalCount: 0,
      ...dto,
    };
  }),

  save: jest.fn((dto: CreateUserDto) =>
    Promise.resolve({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...dto,
    }),
  ),

  exist: jest.fn((options) => {
    if (options.where.name == 'test') return Promise.resolve(true);
    if (options.where.email == 'test@test.test') return Promise.resolve(true);
    return Promise.resolve(false);
  }),
});
