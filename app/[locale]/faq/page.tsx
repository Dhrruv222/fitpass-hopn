'use client';

import { PublicNav } from '@/components/PublicNav';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How do I check in at a partner location?',
      a: 'Log in to your account, generate a QR code from your dashboard, and show it to the partner reception.',
    },
    {
      q: 'Can I change my plan?',
      a: 'Yes, contact your HR administrator who can change your plan at any time.',
    },
    {
      q: 'What happens if I exceed my monthly check-ins?',
      a: 'Additional check-ins may be purchased or you can upgrade to a higher tier.',
    },
    {
      q: 'Are there any hidden fees?',
      a: 'No, the membership price includes all standard services at partner locations.',
    },
    {
      q: 'Can I use my membership at any partner?',
      a: 'You can use your membership at any approved partner whose category is included in your plan.',
    },
    {
      q: 'How do I invite employees to join?',
      a: 'HR administrators can invite employees through the Company Portal by adding their email addresses.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold flex-1">{faq.q}</h3>
                <span className="text-2xl text-gray-400">{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && (
                <p className="mt-4 text-gray-600">{faq.a}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
