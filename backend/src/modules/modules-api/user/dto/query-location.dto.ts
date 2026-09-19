// dto/query-image.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
  @ApiPropertyOptional({ example: 1, description: 'Trang hiện tại' })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Số item mỗi trang' })
  @IsOptional()
  @IsInt()
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
