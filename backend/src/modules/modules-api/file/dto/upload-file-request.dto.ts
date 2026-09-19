import { ApiProperty } from '@nestjs/swagger';

export class UploadFileRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File upload',
  })
  file: any;
}
