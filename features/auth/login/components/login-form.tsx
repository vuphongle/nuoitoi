'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/auth.store';
import { useProfile } from '@/hooks/use-profile';
import { handleAdminSessionExpiry } from '@/lib/admin-api-client';
import { useQueryClient } from '@tanstack/react-query';
import { profileQueryOptions } from '@/hooks/profile-query';
import { ROUTES } from '@/constants';
import { LANGUAGES } from '@/constants/lang';
import { icons } from '@/shared/assets';
import { useI18n } from '@/hooks/useI18n';
import { loginSchema, type LoginFormData } from '../schemas';
import { loginApi } from '../services';
import { getLoginProfileAction } from '../login-profile-flow';

export function LoginForm() {
  const { t, currentLanguage, changeLanguage, isHydrated } = useI18n();
  const displayedLanguage = isHydrated ? currentLanguage : LANGUAGES.VI;
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const profileQuery = useProfile({
    enabled: !isSubmitting,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const profileAction = getLoginProfileAction({
    isFetchedAfterMount: profileQuery.isFetchedAfterMount,
    isSuccess: profileQuery.isSuccess,
    profile: profileQuery.data,
    error: profileQuery.error,
  });
  const displayedError =
    error ||
    (profileAction === 'show-error' && profileQuery.error instanceof Error
      ? profileQuery.error.message
      : null);

  React.useEffect(() => {
    if (profileAction === 'redirect') router.replace(ROUTES.USERS);
    if (profileAction === 'cleanup-role') {
      handleAdminSessionExpiry().catch((error) => {
        console.error('Failed to clean up expired admin session:', error);
      });
    }
  }, [profileAction, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await handleAdminSessionExpiry();
      await loginApi.login(data);
      const profile = await queryClient.fetchQuery(profileQueryOptions());
      setUser(profile);
      const action = getLoginProfileAction({
        isFetchedAfterMount: true,
        isSuccess: true,
        profile,
        error: null,
      });

      if (action === 'redirect') {
        router.replace(ROUTES.USERS);
        return;
      }

      if (action === 'cleanup-role') await handleAdminSessionExpiry();
      throw new Error(t('login.profileLoadFailed'));
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : t('login.invalidCredentials');
      setError(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Top Right Language Selector */}
      <div className="absolute top-5 right-6 z-50">
        <Select value={displayedLanguage} onValueChange={changeLanguage}>
          <SelectTrigger className="w-35 bg-white/90 backdrop-blur border-slate-200 shadow-sm">
            <Image
              width={16}
              src={displayedLanguage === 'vi' ? icons.iconVN : icons.iconUS}
              alt="language"
              className="object-cover cursor-pointer"
              priority
            />
            <SelectValue placeholder={t('header.language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={LANGUAGES.VI}>Tiếng Việt</SelectItem>
            <SelectItem value={LANGUAGES.EN}>English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar-active relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-4 border-white" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-24 h-24 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Image src={icons.iconLogoHQ} alt="logo" width={96} height={96} />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center leading-tight">
            {t('login.bannerTitleLine1')}
            <br />
            {t('login.bannerTitleLine2')}
          </h1>
          <p className="text-white/80 text-center max-w-md leading-relaxed">
            {t('login.bannerDescription')}
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-sidebar-active flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-sidebar-active">NuoiToi</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t('login.title')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {displayedError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {displayedError}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" required>
                {t('login.emailLabel')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-7 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder={t('login.emailPlaceholder')}
                className="pl-11 h-12"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" required>
                  {t('login.passwordLabel')}
                </Label>
                <button
                  type="button"
                  className="text-sm cursor-pointer text-sidebar-active hover:text-[#2d66d4] font-medium transition-colors"
                >
                  {t('login.forgotPassword')}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-5 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-3 top-5 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('login.passwordPlaceholder')}
                className="pl-11 pr-11 h-12 border-red-100"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="cursor-pointer w-full h-12 bg-sidebar-active hover:bg-sidebar-active text-white font-semibold shadow-lg shadow-sidebar-active/20"
              disabled={profileQuery.isFetching || isSubmitting}
              isLoading={isSubmitting}
            >
              {t('login.submitButton')}
            </Button>

            {/* Back to Home Link */}
            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-sidebar-active transition-colors font-medium cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('login.backToHome')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
