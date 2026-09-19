import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    example: 'images/abcd1234',
    description: 'Public ID trên Cloudinary',
  })
  publicId: string;

  @ApiProperty({
    example: 'image/upload/v1695378654/images/abcd1234',
    description: 'Đường dẫn key trong Cloudinary',
  })
  fileKey: string;

  @ApiProperty({ example: 123456, description: 'Dung lượng file (bytes)' })
  bytes: number;
}
