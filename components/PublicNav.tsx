'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';

export const PublicNav = () => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/pricing`, label: t('pricing') },
    { href: `/${locale}/partners`, label: t('partners') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/faq`, label: t('faq') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center group">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">HOPn</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-10 md:space-x-8 rtl:space-x-reverse">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-all duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={switchLocale}
              className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 hover:text-primary-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary-50"
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm font-semibold">
                {locale === 'en' ? 'العربية' : 'English'}
              </span>
            </button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
              <Link href={`/${locale}/auth/login`}>
                <Button variant="ghost" size="sm">
                  {t('login')}
                </Button>
              </Link>
              <Link href={`/${locale}/auth/register`}>
                <Button size="sm" className="shadow-lg hover:shadow-xl">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg animate-fadeInUp">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200 space-y-2">
              <Link href={`/${locale}/auth/login`} onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">
                  {t('login')}
                </Button>
              </Link>
              <Link href={`/${locale}/auth/register`} onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="w-full shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
