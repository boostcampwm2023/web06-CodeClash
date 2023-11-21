import { BadRequestException, Injectable } from '@nestjs/common';
import { UserTable } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserTable)
    private readonly usersRepository: Repository<UserTable>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const exName = await this.usersRepository.exist({
      where: { name: createUserDto.name },
    });
    const exEmail = await this.usersRepository.exist({
      where: { email: createUserDto.email },
    });

    if (exName) throw new BadRequestException('이미 존재하는 이름입니다.');
    if (exEmail) throw new BadRequestException('이미 존재하는 이메일입니다.');

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async getUserByName(name: string) {
    return await this.usersRepository.findOne({
      where: { name },
      relations: ['submissions'],
    });
  }
}
