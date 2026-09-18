import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildProfilePatch,
  passwordSettingsSchema,
  profileSettingsSchema,
} from './profile-form.ts';

test('builds a patch from dirty allowlisted fields and preserves empty strings', () => {
  const patch = buildProfilePatch(
    {
      name: 'Admin',
      phone: '',
      birth_day: '2000-10-01',
      gender: 'Male',
      avatar: 'https://example.com/avatar.jpg',
      lang: 'vi',
      email: 'admin@example.com',
    },
    {
      name: false,
      phone: true,
      birth_day: true,
      gender: false,
      avatar: false,
      lang: false,
      email: true,
    }
  );

  assert.deepEqual(patch, {
    phone: '',
    birth_day: '2000-10-01',
  });
});

test('omits undefined dirty values', () => {
  assert.deepEqual(
    buildProfilePatch({ name: undefined, phone: undefined }, { name: true, phone: true }),
    {}
  );
});

test('accepts valid profile values including an empty avatar and date', () => {
  const result = profileSettingsSchema.safeParse({
    name: 'Nguyen Minh Huy',
    email: 'admin@gmail.com',
    phone: '0912345678',
    birth_day: '',
    gender: 'Male',
    avatar: '',
    lang: 'vi',
  });

  assert.equal(result.success, true);
});

test('rejects impossible dates and non-http avatar URLs', () => {
  const invalidDate = profileSettingsSchema.safeParse({
    name: 'Admin',
    email: 'admin@gmail.com',
    phone: '',
    birth_day: '2026-02-30',
    gender: 'Other',
    avatar: '',
    lang: 'en',
  });
  const invalidAvatar = profileSettingsSchema.safeParse({
    name: 'Admin',
    email: 'admin@gmail.com',
    phone: '',
    birth_day: '2000-10-01',
    gender: 'Female',
    avatar: 'ftp://example.com/avatar.jpg',
    lang: 'en',
  });

  assert.equal(invalidDate.success, false);
  assert.equal(invalidAvatar.success, false);
});

test('password validation requires eight matching characters without current password', () => {
  assert.equal(
    passwordSettingsSchema.safeParse({
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    }).success,
    true
  );
  assert.equal(
    passwordSettingsSchema.safeParse({
      password: 'short',
      confirmPassword: 'short',
    }).success,
    false
  );
  assert.equal(
    passwordSettingsSchema.safeParse({
      password: 'newPassword123',
      confirmPassword: 'differentPassword',
    }).success,
    false
  );

  const parsed = passwordSettingsSchema.parse({
    password: 'newPassword123',
    confirmPassword: 'newPassword123',
  });
  assert.equal('currentPassword' in parsed, false);
});
