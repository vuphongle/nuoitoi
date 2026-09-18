'use client';

import { Shield, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/hooks/useI18n';
import { ProfileSettingsForm } from './profile-settings-form';
import { SecuritySettingsForm } from './security-settings-form';
import { AdminPageHeader } from '@/features/admin/shared';

export function SettingsDashboard() {
  const { t } = useI18n('settings');

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <AdminPageHeader
        icon={<User className="h-5 w-5" aria-hidden="true" />}
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('subtitle')}
      />

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="grid h-auto min-h-12 w-full grid-cols-1 rounded-2xl border bg-card p-1 shadow-sm">
          <TabsTrigger
            value="profile"
            className="min-h-10 gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            {t('tabs.profile')}
          </TabsTrigger>
          {/* <TabsTrigger
            value="security"
            className="min-h-10 gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <Shield className="h-4 w-4" aria-hidden="true" />
            {t('tabs.security')}
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettingsForm />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
