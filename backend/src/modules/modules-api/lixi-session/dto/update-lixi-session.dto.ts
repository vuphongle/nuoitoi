import { PartialType } from '@nestjs/swagger';
import { CreateLixiSessionDto } from './create-lixi-session.dto';

export class UpdateLixiSessionDto extends PartialType(CreateLixiSessionDto) {}
