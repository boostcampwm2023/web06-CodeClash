import { PickType } from '@nestjs/mapped-types';
import { UserTable } from 'src/users/entities/user.entity';

export class RegisterUserDto extends PickType(UserTable, [
  'name',
  'email',
  'password',
]) {}
