import { PartialType } from '@nestjs/swagger';
import { CreateLixiSessionBodyDto } from './create-lixi-session-body.dto';

export class UpdateLixiSessionBodyDto extends PartialType(
  CreateLixiSessionBodyDto,
) {}
