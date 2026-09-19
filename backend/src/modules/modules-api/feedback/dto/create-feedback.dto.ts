import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { FEEDBACK_TYPES, FeedbackType } from '../feedback.constant';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'Nguyễn Minh Huy' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'bug',
    enum: FEEDBACK_TYPES,
    description: 'Loại phản hồi',
  })
  @IsIn(FEEDBACK_TYPES, {
    message: `type phải là một trong: ${FEEDBACK_TYPES.join(', ')}`,
  })
  type: FeedbackType;

  @ApiProperty({ example: 'Lỗi không đăng nhập được' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Tôi nhập đúng tài khoản nhưng không đăng nhập được',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
