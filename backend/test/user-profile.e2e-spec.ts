import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UserController } from '../src/modules/modules-api/user/user.controller';
import { UserService } from '../src/modules/modules-api/user/user.service';

describe('User profile (e2e)', () => {
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

  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    jest.resetAllMocks();
    userService = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    } as unknown as UserService;

    const moduleFixture = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use((request, _response, next) => {
      request.user = { id: 7 };
      next();
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/users/profile uses the authenticated user', async () => {
    jest.spyOn(userService, 'getProfile').mockResolvedValue(profile);

    await request(app.getHttpServer())
      .get('/api/users/profile')
      .expect(200)
      .expect({
        status: 'success',
        statusCode: 200,
        message: 'Get profile successfully',
        data: {
          ...profile,
          created_at: profile.created_at.toISOString(),
          updated_at: profile.updated_at.toISOString(),
        },
      });
    expect(userService.getProfile).toHaveBeenCalledWith(7);
  });

  it('PATCH /api/users/profile updates editable fields', async () => {
    const dto = { name: 'Huy Nguyen', phone: null };
    const updatedProfile = { ...profile, ...dto };
    jest.spyOn(userService, 'updateProfile').mockResolvedValue(updatedProfile);

    await request(app.getHttpServer())
      .patch('/api/users/profile')
      .send(dto)
      .expect(200)
      .expect({
        status: 'success',
        statusCode: 200,
        message: 'Update profile successfully',
        data: {
          ...updatedProfile,
          created_at: updatedProfile.created_at.toISOString(),
          updated_at: updatedProfile.updated_at.toISOString(),
        },
      });
    expect(userService.updateProfile).toHaveBeenCalledWith(7, dto);
  });

  it('PATCH /api/users/profile rejects password updates', async () => {
    await request(app.getHttpServer())
      .patch('/api/users/profile')
      .send({ password: 'forbidden' })
      .expect(400);
    expect(userService.updateProfile).not.toHaveBeenCalled();
  });

  it('PATCH /api/users/profile rejects role updates', async () => {
    await request(app.getHttpServer())
      .patch('/api/users/profile')
      .send({ role: 'admin' })
      .expect(400);
    expect(userService.updateProfile).not.toHaveBeenCalled();
  });

  it.each([
    ['numeric name', { name: 123 }],
    ['boolean gender', { gender: false }],
  ])('PATCH /api/users/profile rejects %s', async (_label, payload) => {
    await request(app.getHttpServer())
      .patch('/api/users/profile')
      .send(payload)
      .expect(400);
    expect(userService.updateProfile).not.toHaveBeenCalled();
  });
});
