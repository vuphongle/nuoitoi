import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'admin@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456789' })
  password: string;
}
