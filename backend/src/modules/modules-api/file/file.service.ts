import { Injectable } from '@nestjs/common';
// import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // Upload file
  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('File not found');
    }

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'images' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });


    return {
      success: true,
      publicId: result.public_id,
      fileKey: `https://res.cloudinary.com/dyviq6nrh/image/upload/v${result.version}/${result.public_id}.${result.format}`,
      bytes: result.bytes,
    };
  }

  // Delete file
  async deleteFile(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== 'ok') {
        return {
          success: false,
          message: 'Delete failed',
          result,
        };
      }

      return {
        success: true,
        publicId,
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
