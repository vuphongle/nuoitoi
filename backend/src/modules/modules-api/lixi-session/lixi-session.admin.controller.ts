import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LixiSessionService } from './lixi-session.service';
import { CreateLixiSessionBodyDto } from './dto/create-lixi-session-body.dto';
import { UpdateLixiSessionBodyDto } from './dto/update-lixi-session-body.dto';
import { QueryLixiSessionDto } from './dto/query-lixi-session.dto';
import { responseSuccess } from '../../../common/helpers/response.helper';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../../common/decorators/current-user.decorator';
import { FileService } from '../file/file.service';
import {
  LIXI_SESSION_ALLOWED_IMAGE_MIME,
  LIXI_SESSION_MAX_IMAGE_SIZE,
} from './lixi-session.constant';

type LixiSessionUploadedFiles = {
  qr?: Express.Multer.File[];
  avatar?: Express.Multer.File[];
};

const lixiSessionImageFields = FileFieldsInterceptor([
  { name: 'qr', maxCount: 1 },
  { name: 'avatar', maxCount: 1 },
]);

const lixiSessionFormSchema = (required: string[]) => ({
  type: 'object' as const,
  properties: {
    code: { type: 'string', example: 'TET-2026' },
    name: { type: 'string', example: 'Lì xì Tết 2026' },
    tagline: { type: 'string', example: 'An khang thịnh vượng' },
    bank: { type: 'string', example: 'Vietcombank' },
    account: { type: 'string', example: '0123456789' },
    owner: { type: 'string', example: 'Nguyễn Minh Huy' },
    content: { type: 'string', example: 'Mung tuoi nam moi 2026' },
    sort_order: { type: 'number', example: 0 },
    qr: { type: 'string', format: 'binary', description: 'Ảnh mã QR' },
    avatar: { type: 'string', format: 'binary', description: 'Ảnh đại diện' },
  },
  required,
});

@ApiTags('Admin - Lixi Sessions')
@ApiBearerAuth('access-token')
@Controller('admin/lixi-sessions')
export class LixiSessionAdminController {
  constructor(
    private readonly lixiSessionService: LixiSessionService,
    private readonly fileService: FileService,
  ) {}

  private assertValidImage(file: Express.Multer.File, fieldName: string) {
    if (!LIXI_SESSION_ALLOWED_IMAGE_MIME.test(file.mimetype)) {
      throw new BadRequestException(
        `${fieldName} phải là file ảnh (jpg, png, webp, gif)`,
      );
    }

    if (file.size > LIXI_SESSION_MAX_IMAGE_SIZE) {
      throw new BadRequestException(
        `${fieldName} vượt quá dung lượng cho phép (5MB)`,
      );
    }
  }

  @Post()
  @UseInterceptors(lixiSessionImageFields)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: lixiSessionFormSchema([
      'code',
      'name',
      'tagline',
      'bank',
      'account',
      'owner',
      'content',
      'qr',
      'avatar',
    ]),
  })
  @ApiOperation({
    summary: 'Create a new lixi session (gửi kèm file qr, avatar)',
  })
  @ApiResponse({
    status: 201,
    description: 'Lixi session created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input, thiếu file hoặc code đã tồn tại',
  })
  async create(
    @Body() dto: CreateLixiSessionBodyDto,
    @UploadedFiles() files: LixiSessionUploadedFiles,
  ) {
    const qrFile = files?.qr?.[0];
    const avatarFile = files?.avatar?.[0];

    if (!qrFile || !avatarFile) {
      throw new BadRequestException('qr và avatar là bắt buộc');
    }

    this.assertValidImage(qrFile, 'qr');
    this.assertValidImage(avatarFile, 'avatar');

    const [qrUpload, avatarUpload] = await Promise.all([
      this.fileService.uploadFile(qrFile),
      this.fileService.uploadFile(avatarFile),
    ]);

    const result = await this.lixiSessionService.create({
      ...dto,
      qr: qrUpload.fileKey,
      avatar: avatarUpload.fileKey,
    });

    return responseSuccess(result, 'Create lixi session successfully');
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of lixi sessions (with pagination and search)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of lixi sessions returned successfully',
  })
  async findAll(@Query() query: QueryLixiSessionDto) {
    const result = await this.lixiSessionService.findAll(query);
    return responseSuccess(result, 'Get lixi sessions successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lixi session by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Lixi session not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.lixiSessionService.findOne(id);
    return responseSuccess(result, 'Get lixi session successfully');
  }

  @Patch(':id')
  @UseInterceptors(lixiSessionImageFields)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: lixiSessionFormSchema([]),
  })
  @ApiOperation({
    summary: 'Update lixi session by ID (có thể gửi kèm file qr, avatar mới)',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Lixi session not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLixiSessionBodyDto,
    @UploadedFiles() files: LixiSessionUploadedFiles,
  ) {
    const qrFile = files?.qr?.[0];
    const avatarFile = files?.avatar?.[0];

    if (qrFile) this.assertValidImage(qrFile, 'qr');
    if (avatarFile) this.assertValidImage(avatarFile, 'avatar');

    const [qrUpload, avatarUpload] = await Promise.all([
      qrFile ? this.fileService.uploadFile(qrFile) : Promise.resolve(null),
      avatarFile
        ? this.fileService.uploadFile(avatarFile)
        : Promise.resolve(null),
    ]);

    const result = await this.lixiSessionService.update(id, {
      ...dto,
      ...(qrUpload ? { qr: qrUpload.fileKey } : {}),
      ...(avatarUpload ? { avatar: avatarUpload.fileKey } : {}),
    });

    return responseSuccess(result, `Update lixi session #${id} successfully`);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lixi session by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Lixi session not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.lixiSessionService.remove(id, user.id);
    return responseSuccess(true, `Delete lixi session #${id} successfully`);
  }
}
