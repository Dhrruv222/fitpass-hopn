'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Badge, Loading, EmptyState } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { QrCode, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api/client';
import { Plan, CheckIn, QRToken } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

export default function EmployeeDashboard() {
  const t = useTranslations();
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [qrToken, setQrToken] = useState<QRToken | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrExpiry, setQrExpiry] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (qrToken) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(qrToken.expiresAt).getTime();
        const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
        setQrExpiry(remaining);
        
        if (remaining === 0) {
          setQrToken(null);
          setShowQR(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [qrToken]);

  const loadData = async () => {
    setLoading(true);
    
    // Load plan
    if (user?.planId) {
      const planResponse = await api.getPlan(user.planId);
      if (planResponse.success && planResponse.data) {
        setPlan(planResponse.data);
      }
    }

    // Load check-ins
    const checkInsResponse = await api.getMyCheckIns();
    if (checkInsResponse.success && checkInsResponse.data) {
      setCheckIns(checkInsResponse.data);
    }

    setLoading(false);
  };

  const generateQR = async () => {
    const response = await api.generateQRToken();
    if (response.success && response.data) {
      setQrToken(response.data);
      setShowQR(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t('app.dashboard.welcome')}, {user?.name}!
        </h1>
        <p className="text-gray-600">Manage your wellness journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Plan Card */}
        {plan ? (
          <Card className="lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{t('app.dashboard.myPlan')}</h2>
                <p className="text-gray-600">{plan.name} Tier</p>
              </div>
              <Badge variant="success">{t('common.active')}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">{t('app.dashboard.validity')}</p>
                <p className="font-semibold">{formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Price</p>
                <p className="font-semibold">{formatCurrency(plan.monthlyPrice)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">{t('app.dashboard.checkInsUsed')}</p>
                <p className="text-2xl font-bold text-primary-600">{checkIns.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('app.dashboard.checkInsRemaining')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(0, plan.checkInsPerMonth - checkIns.length)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Included Categories:</p>
              <div className="flex flex-wrap gap-2">
                {plan.includedCategories.map((category, i) => (
                  <Badge key={i} variant="info">{category}</Badge>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <EmptyState
              title="No Active Plan"
              description="Please contact your HR to assign a plan"
              icon={<TrendingUp className="h-12 w-12" />}
            />
          </Card>
        )}

        {/* QR Check-in Card */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">{t('app.dashboard.generateQR')}</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate a QR code to check in at partner locations
          </p>
          <Button onClick={generateQR} className="w-full">
            <QrCode className="h-5 w-5 mr-2" />
            Generate QR Code
          </Button>
        </Card>
      </div>

      {/* Recent Check-ins */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">{t('app.dashboard.recentCheckIns')}</h3>
        {checkIns.length === 0 ? (
          <EmptyState
            title="No check-ins yet"
            description="Use QR code to check in at partner locations"
            icon={<Calendar className="h-12 w-12" />}
          />
        ) : (
          <div className="space-y-3">
            {checkIns.slice(0, 5).map((checkIn) => (
              <div key={checkIn.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{checkIn.partnerName}</p>
                    <p className="text-sm text-gray-600">{formatDate(checkIn.timestamp)}</p>
                  </div>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* QR Modal */}
      {showQR && qrToken && (
        <Modal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          title={t('app.qr.title')}
          size="md"
        >
          <div className="text-center">
            <p className="text-gray-600 mb-6">{t('app.qr.subtitle')}</p>
            
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white border-4 border-primary-600 rounded-lg">
                <QRCodeSVG value={qrToken.token} size={256} />
              </div>
            </div>

            <div className="mb-4">
              {qrExpiry > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('app.qr.expiresIn')}</p>
                  <p className="text-3xl font-bold text-primary-600">{formatTime(qrExpiry)}</p>
                </div>
              ) : (
                <div>
                  <Badge variant="danger">{t('app.qr.expired')}</Badge>
                  <Button onClick={generateQR} className="mt-4">
                    {t('app.qr.generateNew')}
                  </Button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500">Token: {qrToken.token}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
