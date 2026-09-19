import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';

describe('UpdateProfileDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(UpdateProfileDto, payload));

  it('accepts valid partial values', async () => {
    const errors = await validateDto({
      name: 'Nguyen Minh Huy',
      email: 'huy@example.com',
    });

    expect(errors).toHaveLength(0);
  });

  it('rejects an invalid email', async () => {
    const errors = await validateDto({ email: 'not-an-email' });

    expect(errors).not.toHaveLength(0);
  });

  it('rejects a blank name', async () => {
    const errors = await validateDto({ name: '' });

    expect(errors).not.toHaveLength(0);
  });

  it('rejects a blank email', async () => {
    const errors = await validateDto({ email: '' });

    expect(errors).not.toHaveLength(0);
  });

  it.each(['phone', 'birth_day', 'gender', 'avatar'] as const)(
    'accepts null for %s',
    async (field) => {
      const errors = await validateDto({ [field]: null });

      expect(errors).toHaveLength(0);
    },
  );

  it.each(['phone', 'birth_day', 'gender', 'avatar'] as const)(
    'rejects an empty string for %s',
    async (field) => {
      const errors = await validateDto({ [field]: '' });

      expect(errors).not.toHaveLength(0);
    },
  );

  it.each(['password', 'role'] as const)(
    'rejects non-whitelisted property %s',
    async (field) => {
      const pipe = new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      await expect(
        pipe.transform(
          { [field]: 'forbidden' },
          { type: 'body', metatype: UpdateProfileDto },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
});
