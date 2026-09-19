import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LixiSessionService } from './lixi-session.service';
import { responseSuccess } from '../../../common/helpers/response.helper';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Lixi Sessions')
@Public()
@Controller('lixi-sessions')
export class LixiSessionController {
  constructor(private readonly lixiSessionService: LixiSessionService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of active lixi sessions' })
  @ApiResponse({
    status: 200,
    description: 'List of lixi sessions returned successfully',
  })
  async findAll() {
    const result = await this.lixiSessionService.findAllPublic();
    return responseSuccess(result, 'Get lixi sessions successfully');
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get lixi session by code' })
  @ApiParam({ name: 'code' })
  @ApiResponse({ status: 404, description: 'Lixi session not found' })
  async findOne(@Param('code') code: string) {
    const result = await this.lixiSessionService.findOnePublicByCode(code);
    return responseSuccess(result, 'Get lixi session successfully');
  }
}
