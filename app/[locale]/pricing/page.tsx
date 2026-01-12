'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PricingPage() {
  const t = useTranslations('pricing');
  const locale = useLocale();

  const plans = [
    {
      name: t('bronze.name'),
      price: 199,
      description: t('bronze.description'),
      features: ['8 check-ins/month', 'Gym access', 'Basic facilities'],
    },
    {
      name: t('silver.name'),
      price: 399,
      description: t('silver.description'),
      features: ['16 check-ins/month', 'Gym & Spa access', 'Premium equipment', 'Group classes'],
      popular: true,
    },
    {
      name: t('gold.name'),
      price: 599,
      description: t('gold.description'),
      features: ['30 check-ins/month', 'All facilities', 'Personal training', 'Priority booking', 'Spa treatments'],
    },
    {
      name: t('clubPlus.name'),
      price: 899,
      description: t('clubPlus.description'),
      features: ['Unlimited check-ins', 'Exclusive clubs', 'VIP access', 'Concierge service', 'Premium events'],
    },
    {
      name: t('digital.name'),
      price: 99,
      description: t('digital.description'),
      features: ['Unlimited digital access', 'Online classes', 'Wellness content', 'Mobile app', '24/7 access'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${
                plan.popular ? 'ring-2 ring-primary-600 shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-primary-600 text-white text-center py-1 -mt-6 -mx-6 mb-6 rounded-t-lg">
                  <span className="text-sm font-semibold">Most Popular</span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                <span className="text-gray-600">{t('perMonth')}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/auth/register`}>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  Choose Plan
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Corporate Plans Available</h2>
          <p className="text-gray-600 mb-6">
            Get customized plans for your organization with special pricing
          </p>
          <Link href={`/${locale}/contact`}>
            <Button variant="secondary">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
