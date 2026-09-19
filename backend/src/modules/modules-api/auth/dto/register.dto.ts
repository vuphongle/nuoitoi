import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email người dùng',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', description: 'Mật khẩu đăng nhập' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nguyễn Minh Huy', description: 'Tên người dùng' })
  name: string;

  @IsOptional()
  @ApiProperty({
    example: '1999-01-01',
    description: 'Ngày sinh',
    required: false,
  })
  birth_day?: string;

  @IsOptional()
  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại',
    required: false,
  })
  phone?: string;

  @IsOptional()
  @ApiProperty({ example: 'Male', description: 'Giới tính', required: false })
  gender?: string;

  @IsOptional()
  @ApiProperty({
    example: 'https://cdn.myapp.com/avatar.jpg',
    description: 'Link ảnh đại diện',
    required: false,
  })
  avatar?: string;
}
