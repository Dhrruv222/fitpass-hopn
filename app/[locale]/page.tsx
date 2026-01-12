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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 animate-fadeInUp">
              <span className="block">{t('title')}</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-10 text-primary-50 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              {t('subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <Link href={`/${locale}/auth/register`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  {t('cta')}
                </Button>
              </Link>
              <Link href={`/${locale}/pricing`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-primary-700 shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)" fillOpacity="1"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="gradient-text">{t('features.title')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience wellness reimagined with our innovative platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group animate-fadeInUp"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <Card 
                  hover 
                  className="text-center h-full transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-transparent group-hover:border-primary-200"
                >
                  <div className="flex justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110">
                    <div className="p-4 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-white">Ready to Start Your Wellness Journey?</h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of members already enjoying access to premium wellness facilities
            </p>
            <Link href={`/${locale}/auth/register`}>
              <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg px-12">Get Started Today</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">HOPn</h3>
              <p className="text-gray-400 leading-relaxed">
                Your gateway to wellness excellence
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Product</h4>
              <ul className="space-y-3">
                <li><Link href={`/${locale}/pricing`} className="text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block">Pricing</Link></li>
                <li><Link href={`/${locale}/partners`} className="text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                <li><Link href={`/${locale}/about`} className="text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block">About</Link></li>
                <li><Link href={`/${locale}/contact`} className="text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-3">
                <li><Link href={`/${locale}/faq`} className="text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fitpass HOPn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
