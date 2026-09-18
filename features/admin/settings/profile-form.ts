import { z } from 'zod';
import type { ProfileGender, ProfileLanguage, UpdateProfilePayload } from '../../../types/user.ts';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isCalendarDate(value: string): boolean {
  if (!datePattern.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function isHttpUrl(value: string): boolean {
  if (value === '') return true;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const profileSettingsSchema = z.object({
  name: z.string().refine((value) => value.trim().length > 0, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  birth_day: z
    .string()
    .refine((value) => value === '' || isCalendarDate(value), 'Invalid birth date'),
  gender: z.enum(['Male', 'Female', 'Other']),
  avatar: z.string().refine(isHttpUrl, 'Avatar must be an HTTP(S) URL'),
  lang: z.enum(['vi', 'en']),
});

export const passwordSettingsSchema = z
  .object({
    password: z.string().min(8, 'Password must contain at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
export type PasswordSettingsValues = z.infer<typeof passwordSettingsSchema>;

type ProfilePatchValues = Partial<ProfileSettingsValues>;
type DirtyProfileFields = Partial<Record<keyof ProfileSettingsValues, boolean>>;

const patchFields = ['name', 'phone', 'birth_day', 'gender', 'avatar', 'lang'] as const;

export function buildProfilePatch(
  values: ProfilePatchValues,
  dirtyFields: DirtyProfileFields
): UpdateProfilePayload {
  const payload: UpdateProfilePayload = {};

  for (const field of patchFields) {
    const value = values[field];
    if (!dirtyFields[field] || value === undefined) continue;

    if (field === 'gender') payload.gender = value as ProfileGender;
    else if (field === 'lang') payload.lang = value as ProfileLanguage;
    else payload[field] = value;
  }

  return payload;
}
