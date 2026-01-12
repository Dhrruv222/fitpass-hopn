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
import { User, Building2, Shield, AlertCircle, Lock, Mail } from 'lucide-react';

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
          {/* v1.0.1 - Updated {new Date().toISOString()} */}
        </div>

        <Card className="animate-fadeInUp shadow-xl border-2 border-gray-100" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3 animate-fadeInUp">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Login Failed</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-11 h-5 w-5 text-gray-400" />
              <Input
                label={t('common.email')}
                type="email"
                {...register('email')}
                error={errors.email && t(errors.email.message as any)}
                className="pl-11"
                placeholder="employee@test.com"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-11 h-5 w-5 text-gray-400" />
              <Input
                label={t('common.password')}
                type="password"
                {...register('password')}
                error={errors.password && t(errors.password.message as any)}
                className="pl-11"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <Button type="submit" className="w-full shadow-lg" size="lg" isLoading={isLoading}>
              {isLoading ? 'Signing in...' : t('common.login')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">{t('auth.login.noAccount')} </span>
            <Link
              href={`/${locale}/auth/register`}
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              {t('auth.login.signUp')}
            </Link>
          </div>
        </Card>

        {/* Demo Accounts */}
        <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50 text-gray-600 font-semibold">Quick Demo Access</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {/* Employee Demo */}
            <button
              onClick={() => handleQuickLogin('employee@test.com', 'Test@12345')}
              disabled={isLoading}
              className="flex items-center gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:-translate-y-1"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 text-lg">Employee Dashboard</h3>
                <p className="text-sm text-gray-600 mt-0.5">View bookings, check-in, browse partners</p>
              </div>
              <div className="text-blue-600 font-bold text-sm flex items-center gap-1">
                Login
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            {/* Company Admin Demo */}
            <button
              onClick={() => handleQuickLogin('hr@test.com', 'Test@12345')}
              disabled={isLoading}
              className="flex items-center gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:-translate-y-1"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 text-lg">Company Portal (HR)</h3>
                <p className="text-sm text-gray-600 mt-0.5">Manage employees, plans, usage analytics</p>
              </div>
              <div className="text-purple-600 font-bold text-sm flex items-center gap-1">
                Login
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            {/* Platform Admin Demo */}
            <button
              onClick={() => handleQuickLogin('admin@test.com', 'Test@12345')}
              disabled={isLoading}
              className="flex items-center gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-red-400 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:-translate-y-1"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 text-lg">Admin Panel</h3>
                <p className="text-sm text-gray-600 mt-0.5">Manage companies, partners, platform analytics</p>
              </div>
              <div className="text-red-600 font-bold text-sm flex items-center gap-1">
                Login
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border-2 border-primary-100">
            <p className="text-sm text-center text-gray-700">
              <span className="font-semibold">Demo Password:</span>{' '}
              <code className="bg-white px-3 py-1.5 rounded-lg font-mono text-primary-700 border border-primary-200 shadow-sm">Test@12345</code>
            </p>
            <p className="text-xs text-center text-gray-600 mt-2">
              Click any card above for instant access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
