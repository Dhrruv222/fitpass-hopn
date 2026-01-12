'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Building2, CreditCard, Users, TrendingUp, Globe, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function AdminNav() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const navItems = [
    { href: `/${locale}/admin`, label: t('admin.companies.title'), icon: <Building2 className="h-5 w-5" /> },
    { href: `/${locale}/admin/plans`, label: t('admin.plans.title'), icon: <CreditCard className="h-5 w-5" /> },
    { href: `/${locale}/admin/partners`, label: t('admin.partners.title'), icon: <Users className="h-5 w-5" /> },
    { href: `/${locale}/admin/analytics`, label: t('admin.analytics.title'), icon: <TrendingUp className="h-5 w-5" /> },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}/admin`} className="text-2xl font-bold text-primary-600">
              HOPn <span className="text-sm font-normal text-gray-600">Admin</span>
            </Link>

            <div className="hidden md:flex md:ml-10 md:space-x-4 rtl:space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition',
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={switchLocale}
              className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 hover:text-primary-600"
            >
              <Globe className="h-5 w-5" />
            </button>

            <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('nav.logout')}
              </Button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  return (
    <AuthProvider requireAuth allowedRoles={['platform_admin']} locale={params.locale}>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main>{children}</main>
      </div>
    </AuthProvider>
  );
}
