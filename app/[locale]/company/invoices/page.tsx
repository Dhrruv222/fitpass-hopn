'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Badge, Loading, EmptyState } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Download, FileText } from 'lucide-react';
import api from '@/lib/api/client';
import { Invoice } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function CompanyInvoicesPage() {
  const t = useTranslations();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    const response = await api.getCompanyInvoices();
    if (response.success && response.data) {
      setInvoices(response.data);
    }
    setLoading(false);
  };

  const handleDownload = (invoice: Invoice) => {
    // Mock PDF download
    alert(`Downloading invoice ${invoice.invoiceNumber}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      paid: 'success',
      pending: 'warning',
      overdue: 'danger',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading text="Loading invoices..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('company.invoices.title')}</h1>
        <p className="text-gray-600">View and download invoices</p>
      </div>

      <Card>
        {invoices.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            description="Invoices will appear here once generated"
            icon={<FileText className="h-12 w-12" />}
          />
        ) : (
          <Table
            data={invoices}
            keyExtractor={(inv) => inv.id}
            columns={[
              {
                key: 'invoiceNumber',
                header: t('company.invoices.invoiceNumber'),
                render: (inv) => (
                  <span className="font-medium">{inv.invoiceNumber}</span>
                ),
              },
              {
                key: 'date',
                header: t('company.invoices.date'),
                render: (inv) => formatDate(inv.date),
              },
              {
                key: 'amount',
                header: t('company.invoices.amount'),
                render: (inv) => (
                  <span className="font-semibold">{formatCurrency(inv.amount)}</span>
                ),
              },
              {
                key: 'status',
                header: t('company.invoices.status'),
                render: (inv) => getStatusBadge(inv.status),
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (inv) => (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(inv)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('company.invoices.downloadPDF')}
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
