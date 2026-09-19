import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { responseSuccess } from '../../../common/helpers/response.helper';
import { Public } from '../../../common/decorators/public.decorator';
import { QueryUserDto } from './dto/query-location.dto';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create User
  @Public()
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or email already exists',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return responseSuccess(result, 'Create user successfully');
  }

  // Get All Users
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list of users (with pagination and search)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Search by name, email, or phone',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully',
  })
  async findAll(@Query() query: QueryUserDto) {
    const result = await this.userService.findAll(query);
    return result;
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile returned successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.userService.getProfile(user.id);
    return responseSuccess(result, 'Get profile successfully');
  }

  @Patch('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or email exists' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const result = await this.userService.updateProfile(user.id, dto);
    return responseSuccess(result, 'Update profile successfully');
  }

  // Get Detail User
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const result = await this.userService.findOne(+id);
    return responseSuccess(result, 'Get user successfully');
  }

  // Update User
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const result = await this.userService.update(+id, dto);
    return responseSuccess(result, `Update user #${id} successfully`);
  }

  // Delete User
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete user by ID' })
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(+id);
    return responseSuccess(result, `Delete user #${id} successfully`);
  }
}
