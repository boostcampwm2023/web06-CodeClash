import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}
  @Get()
  getSubmissions() {
    return this.submissionsService.getSubmissions();
  }

  @Get(':userName')
  getSubmissionByUserName(@Param('userName') userName: string) {
    return this.submissionsService.getSubmissionByUserName(userName);
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
    return this.submissionsService.getLastSubmission(userName, problemId);
  }
}
