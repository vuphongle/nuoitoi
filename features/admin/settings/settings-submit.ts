import {
  buildProfilePatch,
  passwordSettingsSchema,
  profileSettingsSchema,
  type PasswordSettingsValues,
  type ProfileSettingsValues,
} from './profile-form.ts';
import { ProfileRefreshAfterUpdateError } from '../../../hooks/profile-refresh.ts';

type DirtyProfileFields = Partial<Record<keyof ProfileSettingsValues, boolean>>;
type MutationResult = unknown;

function isRefreshWarning(value: unknown): value is { updated: true; refreshError: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'updated' in value &&
    value.updated === true &&
    'refreshError' in value
  );
}

export async function submitProfileSettings({
  values,
  dirtyFields,
  mutate,
}: {
  values: ProfileSettingsValues;
  dirtyFields: DirtyProfileFields;
  mutate: (payload: ReturnType<typeof buildProfilePatch>) => Promise<MutationResult>;
}) {
  const parsed = profileSettingsSchema.safeParse(values);
  if (!parsed.success) return { status: 'validation-error' as const, error: parsed.error };

  const payload = buildProfilePatch(parsed.data, dirtyFields);
  if (Object.keys(payload).length === 0) return { status: 'unchanged' as const };

  try {
    const result = await mutate(payload);
    if (isRefreshWarning(result)) {
      return {
        status: 'updated-with-warning' as const,
        refreshError: result.refreshError,
      };
    }
    return { status: 'updated' as const, profile: result };
  } catch (error) {
    if (error instanceof ProfileRefreshAfterUpdateError) {
      return { status: 'updated-with-warning' as const, refreshError: error.cause };
    }
    return { status: 'patch-error' as const, error };
  }
}

export async function submitPasswordSettings({
  values,
  mutate,
  clear,
}: {
  values: PasswordSettingsValues;
  mutate: (payload: { password: string }) => Promise<MutationResult>;
  clear: () => void;
}) {
  const parsed = passwordSettingsSchema.safeParse(values);
  if (!parsed.success) return { status: 'validation-error' as const, error: parsed.error };

  try {
    const result = await mutate({ password: parsed.data.password });
    clear();
    if (isRefreshWarning(result)) {
      return {
        status: 'updated-with-warning' as const,
        refreshError: result.refreshError,
      };
    }
    return { status: 'updated' as const, profile: result };
  } catch (error) {
    if (error instanceof ProfileRefreshAfterUpdateError) {
      clear();
      return { status: 'updated-with-warning' as const, refreshError: error.cause };
    }
    return { status: 'patch-error' as const, error };
  }
}
