import { Body, Controller, Get, Param } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SearchSubmissionDto } from './dto/search-submission.dto';

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
  getLastSubmission(@Body() searchSubmissionDto: SearchSubmissionDto) {
    return this.submissionsService.getLastSubmission(searchSubmissionDto);
  }
}
