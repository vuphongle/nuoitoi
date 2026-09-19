import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLixiSessionDto {
  @ApiProperty({ example: 'TET-2026', description: 'Mã định danh, duy nhất' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'code chỉ được chứa chữ, số, dấu gạch ngang (-) hoặc gạch dưới (_)',
  })
  code: string;

  @ApiProperty({ example: 'Lì xì Tết 2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Chúc mừng năm mới - An khang thịnh vượng' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  tagline: string;

  @ApiProperty({ example: 'Vietcombank' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  bank: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[0-9]+$/, { message: 'account chỉ được chứa chữ số' })
  account: string;

  @ApiProperty({ example: 'Nguyễn Minh Huy' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  owner: string;

  @ApiProperty({ example: 'Mung tuoi nam moi 2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  content: string;

  @ApiProperty({ example: 'https://cdn.example.com/qr/tet-2026.png' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  qr: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar/tet-2026.png' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  avatar: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Thứ tự hiển thị, số nhỏ hơn hiển thị trước',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(999999)
  sort_order?: number;
}
