'use client';

import { useTranslations } from 'next-intl';
import { Card, EmptyState } from '@/components/ui/Card';
import { Calendar } from 'lucide-react';

export default function AppBookingsPage() {
  const t = useTranslations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('app.bookings.title')}</h1>
        <p className="text-gray-600">{t('app.bookings.subtitle')}</p>
      </div>

      <Card>
        <EmptyState
          title={t('app.bookings.noBookings')}
          description="Book classes and appointments at partner locations"
          icon={<Calendar className="h-12 w-12" />}
        />
      </Card>
    </div>
  );
}
