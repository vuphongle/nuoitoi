import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { UploadFileRequestDto } from './dto/upload-file-request.dto';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // Upload file
  @Post('upload')
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file lên Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Upload file thành công',
    type: UploadFileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'File không hợp lệ hoặc upload thất bại',
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  // Delete file
  @Delete('images/:publicId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Xóa file theo publicId trên Cloudinary' })
  @ApiParam({
    name: 'publicId',
    type: String,
    example: 'a4rao0w9fmuexcvnsyzp',
    description: 'Public ID của file (Không kèm folder "images/")',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa file thành công',
    schema: {
      example: {
        success: true,
        publicId: 'images/a4rao0w9fmuexcvnsyzp',
        message: 'File deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Xóa thất bại hoặc publicId không hợp lệ',
    schema: {
      example: {
        success: false,
        message: 'Delete failed',
        result: {},
      },
    },
  })
  async deleteFile(@Param('publicId') publicId: string) {
    // Tự thêm prefix "images/" ở đây
    return this.fileService.deleteFile(`images/${publicId}`);
  }
}
