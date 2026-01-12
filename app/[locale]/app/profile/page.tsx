'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';

export default function AppProfilePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('app.profile.title')}</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('app.profile.personalInfo')}</h2>
          <div className="space-y-4">
            <Input
              label={t('common.name')}
              value={user?.name || ''}
              disabled
            />
            <Input
              label={t('common.email')}
              value={user?.email || ''}
              disabled
            />
            {user?.companyCode && (
              <Input
                label="Company Code"
                value={user.companyCode}
                disabled
              />
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('app.profile.preferences')}</h2>
          <div className="space-y-4">
            <Select
              label={t('app.profile.language')}
              value={locale}
              onChange={(e) => handleLanguageChange(e.target.value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'ar', label: 'العربية' },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
