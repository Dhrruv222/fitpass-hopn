'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Card, Badge, Loading, EmptyState } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { MapPin, Plus, Check, X, Pause } from 'lucide-react';
import api from '@/lib/api/client';
import { Partner, PartnerStatus } from '@/lib/types';

export default function AdminPartnersPage() {
  const t = useTranslations();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    const response = await api.getAllPartners();
    if (response.success && response.data) {
      setPartners(response.data);
    }
    setLoading(false);
  };

  const onCreate = async (data: any) => {
    const partnerData = {
      ...data,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    };
    const response = await api.createPartner(partnerData);
    if (response.success) {
      setShowCreateModal(false);
      reset();
      loadPartners();
    }
  };

  const updateStatus = async (partnerId: string, status: PartnerStatus) => {
    const response = await api.updatePartnerStatus(partnerId, status);
    if (response.success) {
      loadPartners();
    }
  };

  const getStatusBadge = (status: PartnerStatus) => {
    const variants: Record<PartnerStatus, any> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      suspended: 'default',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading text="Loading partners..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.partners.title')}</h1>
          <p className="text-gray-600">Manage wellness partners</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          {t('admin.partners.addPartner')}
        </Button>
      </div>

      <Card>
        {partners.length === 0 ? (
          <EmptyState
            title="No partners yet"
            icon={<MapPin className="h-12 w-12" />}
          />
        ) : (
          <Table
            data={partners}
            keyExtractor={(p) => p.id}
            columns={[
              {
                key: 'name',
                header: t('admin.partners.partnerName'),
                render: (p) => (
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.address}</p>
                  </div>
                ),
              },
              {
                key: 'type',
                header: t('admin.partners.type'),
                render: (p) => <Badge variant="info">{p.type}</Badge>,
              },
              {
                key: 'city',
                header: t('admin.partners.city'),
              },
              {
                key: 'rating',
                header: 'Rating',
                render: (p) => `${p.rating} / 5.0`,
              },
              {
                key: 'status',
                header: 'Status',
                render: (p) => getStatusBadge(p.status),
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (p) => (
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    {p.status === PartnerStatus.PENDING && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => updateStatus(p.id, PartnerStatus.APPROVED)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => updateStatus(p.id, PartnerStatus.REJECTED)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {p.status === PartnerStatus.APPROVED && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(p.id, PartnerStatus.SUSPENDED)}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={t('admin.partners.addPartner')}
        size="lg"
      >
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input
            label={t('admin.partners.partnerName')}
            {...register('name', { required: true })}
            required
          />
          <Select
            label={t('admin.partners.type')}
            {...register('type', { required: true })}
            options={[
              { value: 'gym', label: 'Gym' },
              { value: 'spa', label: 'Spa' },
              { value: 'club', label: 'Club' },
              { value: 'digital', label: 'Digital' },
            ]}
            required
          />
          <Input
            label={t('admin.partners.city')}
            {...register('city', { required: true })}
            required
          />
          <Input
            label={t('admin.partners.address')}
            {...register('address', { required: true })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('admin.partners.latitude')}
              type="number"
              step="0.0001"
              {...register('latitude', { required: true })}
              required
            />
            <Input
              label={t('admin.partners.longitude')}
              type="number"
              step="0.0001"
              {...register('longitude', { required: true })}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">Create Partner</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
