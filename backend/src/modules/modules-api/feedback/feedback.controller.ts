import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { responseSuccess } from '../../../common/helpers/response.helper';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Feedbacks')
@Public()
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new feedback' })
  @ApiResponse({ status: 201, description: 'Feedback submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() dto: CreateFeedbackDto) {
    const result = await this.feedbackService.create(dto);
    return responseSuccess(result, 'Submit feedback successfully');
  }
}
