import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';
import { responseSuccess } from '../../../common/helpers/response.helper';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('Admin - Feedbacks')
@ApiBearerAuth('access-token')
@Controller('admin/feedbacks')
export class FeedbackAdminController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  async create(@Body() dto: CreateFeedbackDto) {
    const result = await this.feedbackService.create(dto);
    return responseSuccess(result, 'Create feedback successfully');
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of feedbacks (with pagination and search)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of feedbacks returned successfully',
  })
  async findAll(@Query() query: QueryFeedbackDto) {
    const result = await this.feedbackService.findAll(query);
    return responseSuccess(result, 'Get feedbacks successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.feedbackService.findOne(id);
    return responseSuccess(result, 'Get feedback successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feedback by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFeedbackDto,
  ) {
    const result = await this.feedbackService.update(id, dto);
    return responseSuccess(result, `Update feedback #${id} successfully`);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.feedbackService.remove(id, user.id);
    return responseSuccess(true, `Delete feedback #${id} successfully`);
  }
}
