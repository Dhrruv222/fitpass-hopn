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
import { User, Building2, Shield } from 'lucide-react';

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

  const handleQuickLogin = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await api.login({ email, password });

      if (response.success && response.data) {
        const { user } = response.data;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fadeInUp">
          <Link href={`/${locale}`}>
            <h1 className="text-5xl font-extrabold mb-2">
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">HOPn</span>
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login.title')}</h2>
          <p className="text-gray-600 text-lg">{t('auth.login.subtitle')}</p>
        </div>

        <Card className="animate-fadeInUp shadow-xl" style={{ animationDelay: '0.1s' }}>
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
        </Card>

        {/* Demo Accounts */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500 font-medium">Quick Demo Access</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {/* Employee Demo */}
            <button
              onClick={() => handleQuickLogin('employee@test.com', 'Test@12345')}
              disabled={isLoading}
              className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Employee Dashboard</h3>
                <p className="text-sm text-gray-500">View bookings, check-in, browse partners</p>
              </div>
              <div className="text-primary-600 font-medium text-sm">Login →</div>
            </button>

            {/* Company Admin Demo */}
            <button
              onClick={() => handleQuickLogin('hr@test.com', 'Test@12345')}
              disabled={isLoading}
              className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Company Portal (HR)</h3>
                <p className="text-sm text-gray-500">Manage employees, plans, usage analytics</p>
              </div>
              <div className="text-purple-600 font-medium text-sm">Login →</div>
            </button>

            {/* Platform Admin Demo */}
            <button
              onClick={() => handleQuickLogin('admin@test.com', 'Test@12345')}
              disabled={isLoading}
              className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-red-400 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Admin Panel</h3>
                <p className="text-sm text-gray-500">Manage companies, partners, platform analytics</p>
              </div>
              <div className="text-red-600 font-medium text-sm">Login →</div>
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-gray-500">
            All demo accounts use password: <code className="bg-gray-100 px-2 py-1 rounded">Test@12345</code>
          </p>
        </div>
      </div>
    </div>
  );
}
