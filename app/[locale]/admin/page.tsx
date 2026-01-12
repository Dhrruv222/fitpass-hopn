'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Card, Badge, Loading, EmptyState } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Building2, Plus } from 'lucide-react';
import api from '@/lib/api/client';
import { Company } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function AdminCompaniesPage() {
  const t = useTranslations();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    const response = await api.getAllCompanies();
    if (response.success && response.data) {
      setCompanies(response.data);
    }
    setLoading(false);
  };

  const onCreate = async (data: any) => {
    const response = await api.createCompany(data);
    if (response.success) {
      setShowCreateModal(false);
      reset();
      loadCompanies();
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading text="Loading companies..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.companies.title')}</h1>
          <p className="text-gray-600">Manage organizations</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          {t('admin.companies.addCompany')}
        </Button>
      </div>

      <Card>
        {companies.length === 0 ? (
          <EmptyState
            title="No companies yet"
            icon={<Building2 className="h-12 w-12" />}
            action={
              <Button onClick={() => setShowCreateModal(true)}>
                Create First Company
              </Button>
            }
          />
        ) : (
          <Table
            data={companies}
            keyExtractor={(c) => c.id}
            columns={[
              {
                key: 'name',
                header: t('admin.companies.companyName'),
                render: (c) => (
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-gray-500">{c.code}</p>
                  </div>
                ),
              },
              {
                key: 'adminEmail',
                header: t('admin.companies.adminEmail'),
              },
              {
                key: 'status',
                header: 'Status',
                render: (c) => (
                  <Badge variant={c.status === 'active' ? 'success' : 'default'}>
                    {c.status}
                  </Badge>
                ),
              },
              {
                key: 'createdAt',
                header: 'Created',
                render: (c) => formatDate(c.createdAt),
              },
            ]}
          />
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={t('admin.companies.createCompany')}
      >
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input
            label={t('admin.companies.companyName')}
            {...register('name', { required: true })}
            required
          />
          <Input
            label={t('admin.companies.companyCode')}
            {...register('code', { required: true })}
            helperText="Unique code for employee registration"
            required
          />
          <Input
            label={t('admin.companies.adminEmail')}
            type="email"
            {...register('adminEmail', { required: true })}
            required
          />
          <Input
            label={t('admin.companies.billingDetails')}
            {...register('billingDetails')}
          />
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">Create Company</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
