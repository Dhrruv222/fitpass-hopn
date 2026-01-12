'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Star, Zap, Crown, Smartphone, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function PricingPage() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: t('bronze.name'),
      price: 199,
      yearlyPrice: 1990,
      description: t('bronze.description'),
      icon: <Award className="h-8 w-8" />,
      color: 'from-amber-600 to-orange-700',
      features: [
        '8 check-ins per month',
        'Access to 100+ gyms',
        'Basic facilities',
        'Mobile app access',
        'Email support'
      ],
      popular: false,
    },
    {
      name: t('silver.name'),
      price: 399,
      yearlyPrice: 3990,
      description: t('silver.description'),
      icon: <Star className="h-8 w-8" />,
      color: 'from-gray-400 to-gray-600',
      features: [
        '16 check-ins per month',
        'Gym & Spa access',
        'Premium equipment',
        'Group classes included',
        'Priority support',
        'Guest passes (2/month)'
      ],
      popular: true,
    },
    {
      name: t('gold.name'),
      price: 599,
      yearlyPrice: 5990,
      description: t('gold.description'),
      icon: <Crown className="h-8 w-8" />,
      color: 'from-yellow-500 to-yellow-600',
      features: [
        '30 check-ins per month',
        'All facilities access',
        'Personal training sessions',
        'Priority booking',
        'Spa treatments included',
        'Nutrition consultation',
        'Guest passes (5/month)'
      ],
      popular: false,
    },
    {
      name: t('clubPlus.name'),
      price: 899,
      yearlyPrice: 8990,
      description: t('clubPlus.description'),
      icon: <Zap className="h-8 w-8" />,
      color: 'from-purple-600 to-purple-800',
      features: [
        'Unlimited check-ins',
        'Exclusive club access',
        'VIP lounge access',
        'Concierge service',
        'Premium events',
        'Unlimited guest passes',
        'Personal wellness coach',
        'Complimentary spa services'
      ],
      popular: false,
    },
    {
      name: t('digital.name'),
      price: 99,
      yearlyPrice: 990,
      description: t('digital.description'),
      icon: <Smartphone className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-700',
      features: [
        'Unlimited digital access',
        '500+ online classes',
        'Wellness content library',
        'Mobile app premium',
        '24/7 on-demand access',
        'Downloadable workouts'
      ],
      popular: false,
    },
  ];

  const getDisplayPrice = (plan: typeof plans[0]) => {
    if (isYearly) {
      const monthlyEquivalent = plan.yearlyPrice / 12;
      return {
        amount: monthlyEquivalent,
        total: plan.yearlyPrice,
        savings: (plan.price * 12) - plan.yearlyPrice
      };
    }
    return { amount: plan.price, total: plan.price, savings: 0 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">{t('subtitle')}</p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                !isYearly
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 relative ${
                isYearly
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {plans.map((plan, index) => {
            const priceInfo = getDisplayPrice(plan);
            return (
              <div
                key={index}
                className={`group animate-fadeInUp ${
                  plan.popular ? 'xl:col-span-1 lg:col-span-1 md:col-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card
                  className={`relative flex flex-col h-full transform transition-all duration-300 ${
                    plan.popular
                      ? 'ring-4 ring-primary-400 shadow-2xl scale-105 bg-gradient-to-br from-white to-primary-50'
                      : 'hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-primary-200'
                  }`}
                  padding="none"
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2">
                        <Star className="h-4 w-4 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-6 pb-4">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} text-white mb-4 shadow-lg`}>
                      {plan.icon}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {formatCurrency(Math.round(priceInfo.amount))}
                        </span>
                        <span className="text-gray-600 font-medium">/mo</span>
                      </div>
                      {isYearly && (
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-600">
                            Billed {formatCurrency(priceInfo.total)} yearly
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            Save {formatCurrency(priceInfo.savings)}/year
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 min-h-[48px]">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <div className="px-6 pb-6 flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start group/item">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check className="h-5 w-5 text-green-500 group-hover/item:scale-110 transition-transform" />
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="p-6 pt-4">
                    <Link href={`/${locale}/auth/register`}>
                      <Button
                        variant={plan.popular ? 'primary' : 'outline'}
                        className="w-full transform transition-all duration-300 hover:scale-105"
                        size="lg"
                      >
                        Choose {plan.name}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Corporate Plans Section */}
        <div className="relative mt-20 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 rounded-3xl"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
          </div>
          
          <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
            <h2 className="text-4xl font-extrabold mb-4 text-white">Corporate & Team Plans</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get customized wellness solutions for your organization with special pricing, dedicated support, and advanced analytics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`}>
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Contact Sales
                </Button>
              </Link>
              <Link href={`/${locale}/about`}>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-primary-700 shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-20 text-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-600 mb-4">Have questions about our pricing?</p>
          <Link href={`/${locale}/faq`}>
            <Button variant="ghost" className="text-primary-600 hover:text-primary-700">
              Visit our FAQ →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
