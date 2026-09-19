import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { responseSuccess } from '../../../common/helpers/response.helper';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    const response = responseSuccess(result, `Login successfully`);
    return response;
  }

  @Post('/register')
  @Public()
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return responseSuccess(result, 'Register successfully');
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
