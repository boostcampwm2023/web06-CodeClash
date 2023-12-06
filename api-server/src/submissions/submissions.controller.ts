import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { UsersService } from 'src/users/users.service';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly usersService: UsersService,
  ) {}
  @Get()
  getSubmissions() {
    return this.submissionsService.getSubmissions();
  }

  @Get('getLastSubmission')
  getLastSubmission(
    @Query('userName') userName: string,
    @Query(
      'problemId',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    problemId: number,
  ) {
    if (!userName) throw new BadRequestException('userName을 입력해주세요.');

    const user = this.usersService.getUserByName(userName);
    if (!user) throw new BadRequestException('존재하지 않는 유저입니다.');

    return this.submissionsService.getLastSubmission(userName, problemId);
  }
}
