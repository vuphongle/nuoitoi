import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

const PreserveInputType = () =>
  Transform(({ obj, key }) => obj[key], { toClassOnly: true });

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyen Minh Huy' })
  @PreserveInputType()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'huy@example.com' })
  @PreserveInputType()
  @ValidateIf((_, value) => value !== undefined)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional({ example: '0912345678', nullable: true })
  @PreserveInputType()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string | null;

  @ApiPropertyOptional({ example: '2000-10-01', nullable: true })
  @PreserveInputType()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  birth_day?: string | null;

  @ApiPropertyOptional({ example: 'male', nullable: true })
  @PreserveInputType()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender?: string | null;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatar.jpg',
    nullable: true,
  })
  @PreserveInputType()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar?: string | null;
}
