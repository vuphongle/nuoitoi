'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, RefreshCw, Save, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotification } from '@/components/ui/notification';
import { useI18n } from '@/hooks/useI18n';
import { useProfile, useUpdateProfile } from '@/hooks/use-profile';
import { getApiErrorMessage } from '@/lib/api-error';
import type { UserProfile } from '@/types';
import { profileSettingsSchema, type ProfileSettingsValues } from '../profile-form';
import { submitProfileSettings } from '../settings-submit';

const emptyValues: ProfileSettingsValues = {
  name: '',
  email: '',
  phone: '',
  birth_day: '',
  gender: 'Other',
  avatar: '',
  lang: 'vi',
};

function valuesFromProfile(profile: UserProfile): ProfileSettingsValues {
  return {
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    birth_day: profile.birth_day || '',
    gender: profile.gender || 'Other',
    avatar: profile.avatar || '',
    lang: profile.lang || 'vi',
  };
}

export function ProfileSettingsForm() {
  const { t } = useI18n('settings');
  const notification = useNotification();
  const profileQuery = useProfile({ retry: false });
  const updateProfile = useUpdateProfile();
  const form = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: emptyValues,
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields, errors, isDirty, isSubmitting },
  } = form;

  useEffect(() => {
    if (profileQuery.data && !isDirty && !isSubmitting) {
      reset(valuesFromProfile(profileQuery.data));
    }
  }, [isDirty, isSubmitting, profileQuery.data, reset]);

  if (profileQuery.isPending) {
    return (
      <Card aria-busy="true">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
          <span className="sr-only">{t('profile.loading')}</span>
        </CardContent>
      </Card>
    );
  }

  if (profileQuery.isError) {
    return (
      <Card>
        <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-semibold">{t('profile.loadErrorTitle')}</h2>
            <p className="text-sm text-muted-foreground">{t('profile.loadError')}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void profileQuery.refetch()}
            className="min-h-11 gap-2"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t('profile.retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    const result = await submitProfileSettings({
      values,
      dirtyFields: dirtyFields as Partial<Record<keyof ProfileSettingsValues, boolean>>,
      mutate: (payload) => updateProfile.mutateAsync(payload),
    });

    if (result.status === 'unchanged') {
      notification.info(t('profile.unchanged'));
    } else if (result.status === 'updated') {
      const profile = result.profile as UserProfile;
      reset(valuesFromProfile(profile));
      notification.success(t('profile.success'));
    } else if (result.status === 'updated-with-warning') {
      notification.warning(t('profile.refreshWarning'));
    } else if (result.status === 'patch-error') {
      notification.error(getApiErrorMessage(result.error, t('profile.error')));
    }
  });

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>{t('profile.title')}</CardTitle>
            <CardDescription className="mt-1">{t('profile.subtitle')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name" required>
                {t('profile.name')}
              </Label>
              <Input
                id="name"
                autoComplete="name"
                error={errors.name?.message}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">{t('profile.email')}</Label>
              <Input
                id="email"
                type="email"
                readOnly
                className="bg-muted/50"
                {...register('email')}
              />
              <p className="text-xs text-muted-foreground">{t('profile.emailHint')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('profile.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                aria-invalid={!!errors.phone}
                {...register('phone')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_day">{t('profile.birthDay')}</Label>
              <Input
                id="birth_day"
                type="date"
                error={errors.birth_day?.message}
                aria-invalid={!!errors.birth_day}
                {...register('birth_day')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">{t('profile.gender')}</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="gender" className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">{t('profile.genders.male')}</SelectItem>
                      <SelectItem value="Female">{t('profile.genders.female')}</SelectItem>
                      <SelectItem value="Other">{t('profile.genders.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lang">{t('profile.language')}</Label>
              <Controller
                name="lang"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="lang" className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="avatar">{t('profile.avatar')}</Label>
              <Input
                id="avatar"
                type="url"
                placeholder="https://..."
                error={errors.avatar?.message}
                aria-invalid={!!errors.avatar}
                {...register('avatar')}
              />
              <p className="text-xs text-muted-foreground">{t('profile.avatarHint')}</p>
            </div>
          </div>

          <div className="flex justify-end border-t pt-5">
            <Button
              type="submit"
              className="min-h-11 w-full gap-2 sm:w-auto"
              disabled={updateProfile.isPending}
              isLoading={updateProfile.isPending}
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {t('profile.saveChanges')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
