import { OmitType } from '@nestjs/swagger';
import { CreateLixiSessionDto } from './create-lixi-session.dto';

export class CreateLixiSessionBodyDto extends OmitType(CreateLixiSessionDto, [
  'qr',
  'avatar',
] as const) {}
