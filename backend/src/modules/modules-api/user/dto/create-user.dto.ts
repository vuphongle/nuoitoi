import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyễn Minh Huy' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;

  @ApiProperty({ example: '0912345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '2000-10-01', required: false })
  @IsOptional()
  @IsString()
  birth_day?: string;

  @ApiProperty({ example: 'male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 'user', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({
    example: 'https://cdn.example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
