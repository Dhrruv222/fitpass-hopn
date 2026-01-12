'use client';

import { PublicNav } from '@/components/PublicNav';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">About HOPn</h1>
        <Card>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              HOPn is a B2B2C wellness membership platform that provides employees with access to premium gyms, spas, and wellness centers across the region.
            </p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              To make wellness accessible and affordable for everyone by providing flexible membership options and a wide network of partners.
            </p>
            <h2 className="text-2xl font-bold mt-6 mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Companies subscribe to HOPn for their employees</li>
              <li>Employees get access to their chosen tier (Bronze, Silver, Gold, Club+, or Digital)</li>
              <li>Check in at partner locations using QR codes</li>
              <li>Enjoy wellness services without additional fees</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
