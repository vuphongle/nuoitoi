import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../../../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');

test('settings dashboard exposes exactly Profile and Security tabs', async () => {
  const contents = await source('features/admin/settings/components/settings-dashboard.tsx');
  assert.equal((contents.match(/<TabsTrigger/g) ?? []).length, 2);
  assert.match(contents, /grid-cols-2/);
  assert.match(contents, /ProfileSettingsForm/);
  assert.match(contents, /SecuritySettingsForm/);
  assert.doesNotMatch(contents, /notifications|appearance/i);
});

test('profile form uses the reusable hook and all supported fields', async () => {
  const contents = await source('features/admin/settings/components/profile-settings-form.tsx');
  assert.match(contents, /useProfile/);
  assert.match(contents, /useUpdateProfile/);
  assert.match(contents, /useNotification/);
  for (const field of ['name', 'email', 'phone', 'birth_day', 'gender', 'avatar', 'lang']) {
    assert.match(contents, new RegExp(field), `missing profile field ${field}`);
  }
  assert.match(contents, /readOnly/);
  assert.match(contents, /updateProfile\.isPending/);
});

test('security form changes only the new password and reports all outcomes', async () => {
  const contents = await source('features/admin/settings/components/security-settings-form.tsx');
  assert.match(contents, /useUpdateProfile/);
  assert.match(contents, /useNotification/);
  assert.match(contents, /password/);
  assert.match(contents, /confirmPassword/);
  assert.doesNotMatch(contents, /currentPassword/);
  assert.match(contents, /updateProfile\.isPending/);
  assert.match(contents, /notification\.success/);
  assert.match(contents, /notification\.error/);
  assert.match(contents, /notification\.warning/);
});

test('settings locales include profile, security, validation, and feedback labels', async () => {
  for (const locale of ['vi', 'en']) {
    const contents = await source(`shared/i18n/locales/${locale}/settings.ts`);
    for (const key of [
      'name',
      'email',
      'phone',
      'birthDay',
      'gender',
      'avatar',
      'language',
      'newPassword',
      'confirmPassword',
      'success',
      'error',
      'refreshWarning',
    ]) {
      assert.match(contents, new RegExp(`${key}:`), `${locale} is missing ${key}`);
    }
  }
});

test('input errors are programmatically associated with their fields', async () => {
  const contents = await source('components/ui/input.tsx');
  assert.match(contents, /aria-describedby/);
  assert.match(contents, /aria-errormessage/);
  assert.match(contents, /role="alert"/);
});
