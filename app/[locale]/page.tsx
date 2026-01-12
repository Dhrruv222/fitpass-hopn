'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { PublicNav } from '@/components/PublicNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dumbbell, Sparkles, QrCode, MapPin, Calendar, Shield } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();

  const features = [
    {
      icon: <Dumbbell className="h-10 w-10 text-primary-600" />,
      title: t('features.flexibility.title'),
      description: t('features.flexibility.description'),
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary-600" />,
      title: t('features.variety.title'),
      description: t('features.variety.description'),
    },
    {
      icon: <QrCode className="h-10 w-10 text-primary-600" />,
      title: t('features.convenience.title'),
      description: t('features.convenience.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/auth/register`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t('cta')}
                </Button>
              </Link>
              <Link href={`/${locale}/pricing`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-primary-600">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of members already enjoying access to premium wellness facilities
          </p>
          <Link href={`/${locale}/auth/register`}>
            <Button size="lg">Get Started Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">HOPn</h3>
              <p className="text-gray-400">
                Your gateway to wellness excellence
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href={`/${locale}/pricing`} className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href={`/${locale}/partners`} className="text-gray-400 hover:text-white">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href={`/${locale}/about`} className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href={`/${locale}/contact`} className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href={`/${locale}/faq`} className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fitpass HOPn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
