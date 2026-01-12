'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Card, Badge, Loading } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api/client';
import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminPlansPage() {
  const t = useTranslations();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const response = await api.getAllPlans();
    if (response.success && response.data) {
      setPlans(response.data);
    }
    setLoading(false);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setValue('name', plan.name);
    setValue('tier', plan.tier);
    setValue('monthlyPrice', plan.monthlyPrice);
    setValue('checkInsPerMonth', plan.checkInsPerMonth);
    setValue('includedCategories', plan.includedCategories.join(', '));
    setValue('description', plan.description);
    setValue('notes', plan.notes);
    setShowModal(true);
  };

  const handleDelete = async (plan: Plan) => {
    if (confirm(`Delete ${plan.name} plan?`)) {
      const response = await api.deletePlan(plan.id);
      if (response.success) {
        loadPlans();
      }
    }
  };

  const onSubmit = async (data: any) => {
    const planData = {
      ...data,
      monthlyPrice: parseFloat(data.monthlyPrice),
      checkInsPerMonth: parseInt(data.checkInsPerMonth),
      includedCategories: data.includedCategories.split(',').map((s: string) => s.trim()),
    };

    if (editingPlan) {
      const response = await api.updatePlan(editingPlan.id, planData);
      if (response.success) {
        setShowModal(false);
        setEditingPlan(null);
        reset();
        loadPlans();
      }
    } else {
      const response = await api.createPlan(planData);
      if (response.success) {
        setShowModal(false);
        reset();
        loadPlans();
      }
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.plans.title')}</h1>
          <p className="text-gray-600">Manage membership tiers</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          {t('admin.plans.addPlan')}
        </Button>
      </div>

      <Card>
        <Table
          data={plans}
          keyExtractor={(p) => p.id}
          columns={[
            {
              key: 'name',
              header: t('admin.plans.tierName'),
              render: (p) => (
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.tier}</p>
                </div>
              ),
            },
            {
              key: 'monthlyPrice',
              header: t('admin.plans.monthlyPrice'),
              render: (p) => <span className="font-semibold">{formatCurrency(p.monthlyPrice)}</span>,
            },
            {
              key: 'checkInsPerMonth',
              header: t('admin.plans.checkInsPerMonth'),
            },
            {
              key: 'includedCategories',
              header: t('admin.plans.includedCategories'),
              render: (p) => (
                <div className="flex flex-wrap gap-1">
                  {p.includedCategories.map((cat, i) => (
                    <Badge key={i} variant="info" size="sm">{cat}</Badge>
                  ))}
                </div>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (p) => (
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPlan(null);
          reset();
        }}
        title={editingPlan ? t('admin.plans.editPlan') : t('admin.plans.addPlan')}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('admin.plans.tierName')}
            {...register('name', { required: true })}
            required
          />
          <Input
            label="Tier Type"
            {...register('tier', { required: true })}
            helperText="e.g., bronze, silver, gold, club_plus, digital"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('admin.plans.monthlyPrice')}
              type="number"
              step="0.01"
              {...register('monthlyPrice', { required: true })}
              required
            />
            <Input
              label={t('admin.plans.checkInsPerMonth')}
              type="number"
              {...register('checkInsPerMonth', { required: true })}
              required
            />
          </div>
          <Input
            label={t('admin.plans.includedCategories')}
            {...register('includedCategories', { required: true })}
            helperText="Comma-separated: Gym, Spa, Club"
            required
          />
          <Input
            label="Description"
            {...register('description')}
          />
          <Textarea
            label={t('admin.plans.notes')}
            rows={3}
            {...register('notes')}
          />
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowModal(false);
                setEditingPlan(null);
                reset();
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {editingPlan ? t('common.save') : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
