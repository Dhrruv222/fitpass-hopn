import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { Tajawal } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import '../globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const tajawal = Tajawal({ 
  weight: ['400', '500', '700'],
  subsets: ['arabic'],
  variable: '--font-tajawal',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: 'Fitpass HOPn - Wellness Membership Platform',
  description: 'Access premium gyms, spas, and wellness centers with a single membership',
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? tajawal.variable : inter.variable;

  return (
    <html lang={locale} dir={direction} className={fontClass}>
      <body className={locale === 'ar' ? 'font-arabic' : 'font-sans'}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
