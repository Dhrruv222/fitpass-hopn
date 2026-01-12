'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Loading } from '@/components/ui/Card';
import { Users, Building2, Activity, TrendingUp } from 'lucide-react';
import api from '@/lib/api/client';
import { Analytics } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalyticsPage() {
  const t = useTranslations();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const response = await api.getAnalytics();
    if (response.success && response.data) {
      setAnalytics(response.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading text="Loading analytics..." />
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      title: t('admin.analytics.totalCheckIns'),
      value: analytics.totalCheckIns.toLocaleString(),
      icon: <Activity className="h-8 w-8 text-primary-600" />,
      change: '+12%',
    },
    {
      title: t('admin.analytics.activeUsers'),
      value: analytics.activeUsers.toLocaleString(),
      icon: <Users className="h-8 w-8 text-green-600" />,
      change: '+8%',
    },
    {
      title: t('admin.analytics.activeCompanies'),
      value: analytics.activeCompanies.toLocaleString(),
      icon: <Building2 className="h-8 w-8 text-blue-600" />,
      change: '+3%',
    },
    {
      title: 'Growth Rate',
      value: '15%',
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      change: '+5%',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('admin.analytics.title')}</h1>
        <p className="text-gray-600">Platform performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between mb-4">
              {stat.icon}
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <h2 className="text-xl font-bold mb-6">{t('admin.analytics.checkInsOverTime')}</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.checkInsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
