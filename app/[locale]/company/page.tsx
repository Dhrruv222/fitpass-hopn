'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Card, Badge, Loading, EmptyState } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { UserPlus, MoreVertical } from 'lucide-react';
import api from '@/lib/api/client';
import { Employee, Plan } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function CompanyEmployeesPage() {
  const t = useTranslations();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    const [employeesRes, plansRes] = await Promise.all([
      api.getCompanyEmployees(),
      api.getPlans(),
    ]);

    if (employeesRes.success && employeesRes.data) {
      setEmployees(employeesRes.data);
    }

    if (plansRes.success && plansRes.data) {
      setPlans(plansRes.data);
    }

    setLoading(false);
  };

  const onInvite = async (data: any) => {
    const response = await api.inviteEmployee(data);
    if (response.success) {
      setShowInviteModal(false);
      reset();
      loadData();
    }
  };

  const onAssignPlan = async (data: any) => {
    if (selectedEmployee) {
      const response = await api.assignPlan(selectedEmployee.id, data.planId);
      if (response.success) {
        setShowAssignModal(false);
        setSelectedEmployee(null);
        loadData();
      }
    }
  };

  const handleDeactivate = async (employee: Employee) => {
    if (confirm('Are you sure you want to deactivate this employee?')) {
      const response = await api.deactivateEmployee(employee.id);
      if (response.success) {
        loadData();
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'success',
      invited: 'warning',
      inactive: 'default',
    };
    return <Badge variant={variants[status]}>{t(`common.${status}`)}</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading text="Loading employees..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('company.employees.title')}</h1>
          <p className="text-gray-600">Manage your team members</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-5 w-5 mr-2" />
          {t('company.employees.addEmployee')}
        </Button>
      </div>

      <Card>
        {employees.length === 0 ? (
          <EmptyState
            title="No employees yet"
            description="Start by inviting employees to your organization"
            action={
              <Button onClick={() => setShowInviteModal(true)}>
                <UserPlus className="h-5 w-5 mr-2" />
                Invite First Employee
              </Button>
            }
          />
        ) : (
          <Table
            data={employees}
            keyExtractor={(emp) => emp.id}
            columns={[
              {
                key: 'name',
                header: t('company.employees.employeeName'),
                render: (emp) => (
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                  </div>
                ),
              },
              {
                key: 'planId',
                header: t('company.employees.plan'),
                render: (emp) => {
                  const plan = plans.find((p) => p.id === emp.planId);
                  return plan ? plan.name : 'No Plan';
                },
              },
              {
                key: 'status',
                header: t('company.employees.status'),
                render: (emp) => getStatusBadge(emp.status),
              },
              {
                key: 'totalCheckIns',
                header: 'Check-ins',
                render: (emp) => emp.totalCheckIns || 0,
              },
              {
                key: 'createdAt',
                header: 'Joined',
                render: (emp) => formatDate(emp.createdAt),
              },
              {
                key: 'actions',
                header: t('company.employees.actions'),
                render: (emp) => (
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowAssignModal(true);
                      }}
                    >
                      {t('company.employees.assignPlan')}
                    </Button>
                    {emp.status === 'active' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeactivate(emp)}
                      >
                        {t('company.employees.deactivate')}
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title={t('company.employees.inviteEmployee')}
      >
        <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
          <Input
            label={t('company.employees.employeeName')}
            {...register('name', { required: true })}
            required
          />
          <Input
            label={t('company.employees.employeeEmail')}
            type="email"
            {...register('email', { required: true })}
            required
          />
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="button" variant="ghost" onClick={() => setShowInviteModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">Send Invite</Button>
          </div>
        </form>
      </Modal>

      {/* Assign Plan Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={t('company.employees.assignPlan')}
      >
        <form onSubmit={handleSubmit(onAssignPlan)} className="space-y-4">
          <p className="text-gray-600">
            Assign plan to {selectedEmployee?.name}
          </p>
          <Select
            label="Select Plan"
            {...register('planId', { required: true })}
            options={plans.map((plan) => ({
              value: plan.id,
              label: `${plan.name} - ${plan.monthlyPrice} SAR/month`,
            }))}
            required
          />
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="button" variant="ghost" onClick={() => setShowAssignModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">Assign Plan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
