import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { UserService } from './user.service';

describe('UserService profile', () => {
  const profile = {
    id: 7,
    name: 'Nguyen Minh Huy',
    email: 'huy@example.com',
    phone: '0912345678',
    birth_day: '2000-10-01',
    gender: 'male',
    role: 'user',
    avatar: 'https://cdn.example.com/avatar.jpg',
    created_at: new Date('2026-01-01T00:00:00.000Z'),
    updated_at: new Date('2026-01-01T00:00:00.000Z'),
  };

  let prisma: PrismaService;
  let service: UserService;

  beforeEach(() => {
    jest.resetAllMocks();
    prisma = {
      users: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as PrismaService;
    service = new UserService(prisma);
  });

  it('returns the active user profile without sensitive fields', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);

    await expect(service.getProfile(7)).resolves.toEqual(profile);
    expect(prisma.users.findFirst).toHaveBeenCalledWith({
      where: { id: 7, is_deleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        avatar: true,
        created_at: true,
        updated_at: true,
      },
    });
  });

  it('returns 404 when the active user profile does not exist', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(null);

    await expect(service.getProfile(7)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns the current profile without updating for an empty patch', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);

    await expect(service.updateProfile(7, {})).resolves.toEqual(profile);
    expect(prisma.users.update).not.toHaveBeenCalled();
  });

  it('updates only editable profile fields and preserves null values', async () => {
    const updatedProfile = { ...profile, name: 'Huy Nguyen', phone: null };
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);
    jest
      .spyOn(prisma.users, 'update')
      .mockResolvedValue(updatedProfile as never);

    const dto = {
      name: 'Huy Nguyen',
      phone: null,
      password: 'must-not-be-forwarded',
      role: 'admin',
    } as Parameters<UserService['updateProfile']>[1];

    await expect(service.updateProfile(7, dto)).resolves.toEqual(
      updatedProfile,
    );
    expect(prisma.users.findFirst).toHaveBeenCalledWith({
      where: { id: 7, is_deleted: false },
    });
    expect(prisma.users.update).toHaveBeenCalledWith({
      where: { id: 7, is_deleted: false },
      data: {
        name: 'Huy Nguyen',
        phone: null,
        updated_at: expect.any(Date),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        avatar: true,
        created_at: true,
        updated_at: true,
      },
    });
  });

  it('returns 404 when updating a profile that does not exist', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(null);

    await expect(
      service.updateProfile(7, { name: 'Huy Nguyen' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.users.update).not.toHaveBeenCalled();
  });

  it('does not check uniqueness when the email is unchanged', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);
    jest.spyOn(prisma.users, 'update').mockResolvedValue(profile as never);

    await expect(
      service.updateProfile(7, { email: profile.email }),
    ).resolves.toEqual(profile);
    expect(prisma.users.findUnique).not.toHaveBeenCalled();
  });

  it('rejects an email already owned by another user', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);
    jest.spyOn(prisma.users, 'findUnique').mockResolvedValue({
      ...profile,
      id: 8,
      email: 'used@example.com',
    } as never);

    await expect(
      service.updateProfile(7, { email: 'used@example.com' }),
    ).rejects.toThrow('Email already exists');
    expect(prisma.users.findUnique).toHaveBeenCalledWith({
      where: { email: 'used@example.com' },
    });
    expect(prisma.users.update).not.toHaveBeenCalled();
  });

  it('keeps emails from soft-deleted users reserved', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);
    jest.spyOn(prisma.users, 'findUnique').mockResolvedValue({
      ...profile,
      id: 8,
      email: 'deleted@example.com',
      is_deleted: true,
    } as never);

    await expect(
      service.updateProfile(7, { email: 'deleted@example.com' }),
    ).rejects.toThrow('Email already exists');
    expect(prisma.users.findUnique).toHaveBeenCalledWith({
      where: { email: 'deleted@example.com' },
    });
  });

  it('translates active profile lookup failures to 500', async () => {
    jest
      .spyOn(prisma.users, 'findFirst')
      .mockRejectedValue(new Error('database unavailable'));

    await expect(
      service.updateProfile(7, { name: 'Huy Nguyen' }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('translates email lookup failures to 500', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);
    jest
      .spyOn(prisma.users, 'findUnique')
      .mockRejectedValue(new Error('database unavailable'));

    await expect(
      service.updateProfile(7, { email: 'new@example.com' }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('translates update failures to 500', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);
    jest
      .spyOn(prisma.users, 'update')
      .mockRejectedValue(new Error('database unavailable'));

    await expect(
      service.updateProfile(7, { name: 'Huy Nguyen' }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('translates a concurrent duplicate email constraint to 400', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);
    jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prisma.users, 'update').mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('constraint', {
        code: 'P2002',
        clientVersion: '6.15.0',
      }),
    );

    await expect(
      service.updateProfile(7, { email: 'new@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('translates a concurrent missing profile update to 404', async () => {
    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(profile as never);
    jest.spyOn(prisma.users, 'update').mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('missing', {
        code: 'P2025',
        clientVersion: '6.15.0',
      }),
    );

    await expect(
      service.updateProfile(7, { name: 'Huy Nguyen' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
