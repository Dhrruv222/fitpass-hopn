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

const registerSchema = z.object({
  name: z.string().min(2, 'validation.required'),
  email: z.string().email('validation.invalidEmail'),
  password: z.string().min(8, 'validation.passwordMin'),
  companyCode: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await api.register(data);

      if (response.success) {
        router.push(`/${locale}/app`);
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
          <h2 className="text-2xl font-bold">{t('auth.register.title')}</h2>
          <p className="text-gray-600">{t('auth.register.subtitle')}</p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('common.name')}
              {...register('name')}
              error={errors.name && t(errors.name.message as any)}
              required
            />

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

            <Input
              label={t('auth.register.companyCode')}
              {...register('companyCode')}
              helperText="Enter your company code if you have one"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {t('common.register')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{t('auth.register.hasAccount')} </span>
            <Link
              href={`/${locale}/auth/login`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('auth.register.signIn')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
