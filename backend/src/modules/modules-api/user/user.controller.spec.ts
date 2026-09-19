import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController profile', () => {
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

  let userService: UserService;
  let controller: UserController;

  beforeEach(() => {
    jest.resetAllMocks();
    userService = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    } as unknown as UserService;
    controller = new UserController(userService);
  });

  it('gets the authenticated user profile', async () => {
    jest.spyOn(userService, 'getProfile').mockResolvedValue(profile);

    await expect(controller.getProfile({ id: 7 } as never)).resolves.toEqual({
      status: 'success',
      statusCode: 200,
      message: 'Get profile successfully',
      data: profile,
    });
    expect(userService.getProfile).toHaveBeenCalledWith(7);
  });

  it('updates the authenticated user profile', async () => {
    const dto = { name: 'Huy Nguyen', phone: null };
    const updatedProfile = { ...profile, ...dto };
    jest.spyOn(userService, 'updateProfile').mockResolvedValue(updatedProfile);

    await expect(
      controller.updateProfile({ id: 7 } as never, dto),
    ).resolves.toEqual({
      status: 'success',
      statusCode: 200,
      message: 'Update profile successfully',
      data: updatedProfile,
    });
    expect(userService.updateProfile).toHaveBeenCalledWith(7, dto);
  });
});
