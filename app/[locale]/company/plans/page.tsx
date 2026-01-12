'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Badge, Loading } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import api from '@/lib/api/client';
import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function CompanyPlansPage() {
  const t = useTranslations();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const response = await api.getPlans();
    if (response.success && response.data) {
      setPlans(response.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading text="Loading plans..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('company.plans.title')}</h1>
        <p className="text-gray-600">{t('company.plans.availablePlans')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{formatCurrency(plan.monthlyPrice)}</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Check-ins:</strong> {plan.checkInsPerMonth}/month
              </p>
              <div>
                <p className="text-sm font-medium mb-2">Included:</p>
                <div className="flex flex-wrap gap-2">
                  {plan.includedCategories.map((cat, i) => (
                    <Badge key={i} variant="info">{cat}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
