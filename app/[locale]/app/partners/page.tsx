'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Card, Badge, Loading, EmptyState } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { MapPin, Star, Clock } from 'lucide-react';
import api from '@/lib/api/client';
import { Partner } from '@/lib/types';

export default function AppPartnersPage() {
  const t = useTranslations();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [filters, setFilters] = useState({ city: 'all', type: 'all' });

  useEffect(() => {
    loadPartners();
  }, [filters]);

  const loadPartners = async () => {
    setLoading(true);
    const response = await api.getPartners(
      filters.city !== 'all' || filters.type !== 'all' ? filters : undefined
    );
    if (response.success && response.data) {
      setPartners(response.data);
    }
    setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('app.partners.title')}</h1>
        <p className="text-gray-600">{t('app.partners.subtitle')}</p>
      </div>

      <div className="mb-6 flex gap-4">
        <Select
          label={t('partners.filters.city')}
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          options={[
            { value: 'all', label: t('partners.filters.allCities') },
            { value: 'Riyadh', label: 'Riyadh' },
            { value: 'Jeddah', label: 'Jeddah' },
            { value: 'Dammam', label: 'Dammam' },
          ]}
        />
        <Select
          label={t('partners.filters.type')}
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          options={[
            { value: 'all', label: t('partners.filters.allTypes') },
            { value: 'gym', label: t('partners.types.gym') },
            { value: 'spa', label: t('partners.types.spa') },
            { value: 'club', label: t('partners.types.club') },
            { value: 'digital', label: t('partners.types.digital') },
          ]}
        />
      </div>

      {partners.length === 0 ? (
        <Card>
          <EmptyState
            title="No partners found"
            description="Try adjusting your filters"
            icon={<MapPin className="h-12 w-12" />}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedPartner(partner)}
            >
              {partner.imageUrl && (
                <img
                  src={partner.imageUrl}
                  alt={partner.name}
                  className="w-full h-40 object-cover rounded-t-md -mt-6 -mx-6 mb-4"
                />
              )}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{partner.name}</h3>
                <Badge variant="info">{t(`partners.types.${partner.type}`)}</Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {partner.city}
                </div>
                {partner.openHours && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {partner.openHours}
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  {partner.rating} / 5.0
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedPartner && (
        <Modal
          isOpen={!!selectedPartner}
          onClose={() => setSelectedPartner(null)}
          title={selectedPartner.name}
        >
          <div className="space-y-4">
            {selectedPartner.imageUrl && (
              <img
                src={selectedPartner.imageUrl}
                alt={selectedPartner.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div className="space-y-2">
              <p><strong>{t('partners.filters.type')}:</strong> {t(`partners.types.${selectedPartner.type}`)}</p>
              <p><strong>{t('partners.filters.city')}:</strong> {selectedPartner.city}</p>
              <p><strong>Address:</strong> {selectedPartner.address}</p>
              {selectedPartner.openHours && (
                <p><strong>{t('partners.openHours')}:</strong> {selectedPartner.openHours}</p>
              )}
              <p><strong>{t('partners.rating')}:</strong> {selectedPartner.rating} / 5.0</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
