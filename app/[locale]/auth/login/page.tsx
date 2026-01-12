'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api/client';
import { UserRole } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
  password: z.string().min(8, 'validation.passwordMin'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await api.login(data);

      if (response.success && response.data) {
        const { user } = response.data;

        // Role-based redirect
        switch (user.role) {
          case UserRole.EMPLOYEE:
            router.push(`/${locale}/app`);
            break;
          case UserRole.COMPANY_ADMIN:
            router.push(`/${locale}/company`);
            break;
          case UserRole.PLATFORM_ADMIN:
            router.push(`/${locale}/admin`);
            break;
          default:
            router.push(`/${locale}/app`);
        }
      } else {
        setError(response.error || t('errors.generic'));
      }
    } catch (err) {
      setError(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <h1 className="text-4xl font-bold text-primary-600 mb-2">HOPn</h1>
          </Link>
          <h2 className="text-2xl font-bold">{t('auth.login.title')}</h2>
          <p className="text-gray-600">{t('auth.login.subtitle')}</p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('common.email')}
              type="email"
              {...register('email')}
              error={errors.email && t(errors.email.message as any)}
              required
            />

            <Input
              label={t('common.password')}
              type="password"
              {...register('password')}
              error={errors.password && t(errors.password.message as any)}
              required
            />

            <div className="flex items-center justify-between">
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {t('common.login')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{t('auth.login.noAccount')} </span>
            <Link
              href={`/${locale}/auth/register`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('auth.login.signUp')}
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">Test Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Employee:</strong> employee@test.com / Test@12345</p>
              <p><strong>HR:</strong> hr@test.com / Test@12345</p>
              <p><strong>Admin:</strong> admin@test.com / Test@12345</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
