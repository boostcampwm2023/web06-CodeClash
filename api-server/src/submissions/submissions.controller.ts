import { Controller, Get, Param } from '@nestjs/common';
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
}
