'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Badge, Loading } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Input';
import api from '@/lib/api/client';
import { formatDate } from '@/lib/utils';

export default function CompanyUsagePage() {
  const t = useTranslations();
  const [usage, setUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    loadUsage();
  }, [dateRange]);

  const loadUsage = async () => {
    setLoading(true);
    const response = await api.getCompanyUsage(dateRange);
    if (response.success && response.data) {
      setUsage(response.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading text="Loading usage data..." />
      </div>
    );
  }

  const totalCheckIns = usage.reduce((sum, emp) => sum + emp.checkIns, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('company.usage.title')}</h1>
        <p className="text-gray-600">Track employee wellness activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-sm text-gray-600 mb-1">{t('company.usage.totalCheckIns')}</h3>
          <p className="text-3xl font-bold text-primary-600">{totalCheckIns}</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-600 mb-1">Active Employees</h3>
          <p className="text-3xl font-bold text-green-600">{usage.filter(e => e.checkIns > 0).length}</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-600 mb-1">Avg Check-ins/Employee</h3>
          <p className="text-3xl font-bold text-blue-600">
            {usage.length > 0 ? (totalCheckIns / usage.length).toFixed(1) : 0}
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-4">
          <Select
            label={t('company.usage.dateRange')}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: '7', label: t('company.usage.last7Days') },
              { value: '30', label: t('company.usage.last30Days') },
              { value: '90', label: t('company.usage.last90Days') },
            ]}
          />
        </div>

        <Table
          data={usage}
          keyExtractor={(item) => item.employeeId}
          columns={[
            {
              key: 'employeeName',
              header: 'Employee',
            },
            {
              key: 'plan',
              header: 'Plan',
              render: (item) => <Badge variant="info">{item.plan}</Badge>,
            },
            {
              key: 'checkIns',
              header: t('company.usage.checkIns'),
              render: (item) => (
                <span className="font-semibold text-primary-600">{item.checkIns}</span>
              ),
            },
            {
              key: 'lastCheckIn',
              header: t('company.usage.lastCheckIn'),
              render: (item) => item.lastCheckIn ? formatDate(item.lastCheckIn) : 'Never',
            },
          ]}
        />
      </Card>
    </div>
  );
}
