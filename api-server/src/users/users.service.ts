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

  async getUserByName(name: string, count: number = 5) {
    // user -> user.submissions -> submission.problem join
    const usersSubmissions = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.submissions', 'submission')
      .leftJoinAndSelect('submission.problem', 'problem')
      .where('user.name = :name', { name })
      .select([
        'user.name',
        'user.email',
        'submission.code',
        'submission.language',
        'submission.status',
        'submission.createdAt',
        'problem.title',
      ])
      .getOne();

    // 제출을 가장 마지막 5개만 가져온다.
    usersSubmissions.submissions = usersSubmissions.submissions.slice(-count);

    return usersSubmissions;
  }

  // 제출한 코드가 맞았을 경우
  async increaseAcceptCount(name: string) {
    const user = await this.usersRepository.findOne({ where: { name } });
    user.acceptCount += 1;
    return await this.usersRepository.save(user);
  }

  // 제출한 코드가 틀렸을 경우
  async increaseFailCount(name: string) {
    const user = await this.usersRepository.findOne({ where: { name } });
    user.failCount += 1;
    return await this.usersRepository.save(user);
  }

  // 하나의 room에서 1등했을 경우
  async increaseWinCount(name: string) {
    const user = await this.usersRepository.findOne({ where: { name } });
    user.winCount += 1;
    return await this.usersRepository.save(user);
  }

  // 하나의 room에서 게임이 시작한 경우
  async increaseTotalCount(name: string) {
    const user = await this.usersRepository.findOne({ where: { name } });
    user.totalCount += 1;
    return await this.usersRepository.save(user);
  }
}
