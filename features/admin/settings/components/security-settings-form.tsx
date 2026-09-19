'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotification } from '@/components/ui/notification';
import { useI18n } from '@/hooks/useI18n';
import { useUpdateProfile } from '@/hooks/use-profile';
import { getApiErrorMessage } from '@/lib/api-error';
import { passwordSettingsSchema, type PasswordSettingsValues } from '../profile-form';
import { submitPasswordSettings } from '../settings-submit';

export function SecuritySettingsForm() {
  const { t } = useI18n('settings');
  const notification = useNotification();
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordSettingsValues>({
    resolver: zodResolver(passwordSettingsSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await submitPasswordSettings({
      values,
      mutate: (payload) => updateProfile.mutateAsync(payload),
      clear: () => reset({ password: '', confirmPassword: '' }),
    });

    if (result.status === 'updated') {
      notification.success(t('security.success'));
    } else if (result.status === 'updated-with-warning') {
      notification.warning(t('security.refreshWarning'));
    } else if (result.status === 'patch-error') {
      notification.error(getApiErrorMessage(result.error, t('security.error')));
    }
  });

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>{t('security.passwordTitle')}</CardTitle>
            <CardDescription className="mt-1">{t('security.passwordSubtitle')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password" required>
                {t('security.newPassword')}
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                aria-invalid={!!errors.password}
                {...register('password')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" required>
                {t('security.confirmPassword')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
            </div>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{t('security.passwordHint')}</p>
          <div className="flex justify-end border-t pt-5">
            <Button
              type="submit"
              className="min-h-11 w-full gap-2 sm:w-auto"
              disabled={updateProfile.isPending}
              isLoading={updateProfile.isPending}
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              {t('security.updatePassword')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
