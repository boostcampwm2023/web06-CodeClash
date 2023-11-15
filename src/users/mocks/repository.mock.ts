import { CreateUserDto } from '../dto/create-user.dto';
import { UserTable } from '../entities/user.entity';

export class UsersMockRepository {
  users = [];

  public async findOne(): Promise<UserTable | undefined> {
    return new UserTable();
  }

  public async create(createUserDto: CreateUserDto): Promise<UserTable> {
    const user = new UserTable();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.id = 1;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
  }

  public async save(user: UserTable): Promise<UserTable> {
    this.users.push(user);
    return user;
  }

  public async exist(createUserDto: CreateUserDto): Promise<boolean> {
    const user = this.users.find(
      (user) =>
        user.name === createUserDto.name || user.email === createUserDto.email,
    );
    return user ? true : false;
  }
}
