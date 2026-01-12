'use client';

import { useTranslations, useLocale } from 'next-intl';
import { PublicNav } from '@/components/PublicNav';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { Loading, EmptyState } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useState, useEffect } from 'react';
import { MapPin, Star, Clock } from 'lucide-react';
import api from '@/lib/api/client';
import { Partner } from '@/lib/types';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function PartnersPage() {
  const t = useTranslations('partners');
  const locale = useLocale();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [filters, setFilters] = useState({
    city: 'all',
    type: 'all',
  });

  const cities = ['all', 'Riyadh', 'Jeddah', 'Dammam'];
  const types = ['all', 'gym', 'spa', 'club', 'digital'];

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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      gym: 'info',
      spa: 'warning',
      club: 'success',
      digital: 'default',
    };
    return colors[type] || 'default';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Select
            label={t('filters.city')}
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            options={cities.map((city) => ({
              value: city,
              label: city === 'all' ? t('filters.allCities') : city,
            }))}
          />
          <Select
            label={t('filters.type')}
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            options={types.map((type) => ({
              value: type,
              label: type === 'all' ? t('filters.allTypes') : t(`types.${type}`),
            }))}
          />
        </div>

        {loading ? (
          <Loading text="Loading partners..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="h-[600px] rounded-lg overflow-hidden shadow-md">
              <Map partners={partners} onMarkerClick={setSelectedPartner} />
            </div>

            {/* Partners List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {partners.length === 0 ? (
                <EmptyState
                  title="No partners found"
                  description="Try adjusting your filters"
                  icon={<MapPin className="h-12 w-12" />}
                />
              ) : (
                partners.map((partner) => (
                  <Card
                    key={partner.id}
                    hover
                    className="cursor-pointer"
                    onClick={() => setSelectedPartner(partner)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold">{partner.name}</h3>
                      <Badge variant={getTypeColor(partner.type) as any}>
                        {t(`types.${partner.type}`)}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {partner.city} - {partner.address}
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
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Partner Details Modal */}
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
            <div>
              <Badge variant={getTypeColor(selectedPartner.type) as any}>
                {t(`types.${selectedPartner.type}`)}
              </Badge>
            </div>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <p className="font-medium">{selectedPartner.city}</p>
                  <p className="text-sm text-gray-500">{selectedPartner.address}</p>
                </div>
              </div>
              {selectedPartner.openHours && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-400" />
                  <p>{selectedPartner.openHours}</p>
                </div>
              )}
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                <p>{selectedPartner.rating} / 5.0</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
