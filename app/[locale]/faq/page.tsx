'use client';

import { PublicNav } from '@/components/PublicNav';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { ChevronDown, Search, HelpCircle, CreditCard, MapPin, Users, Shield, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';

export default function FAQPage() {
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="h-5 w-5" /> },
    { id: 'membership', name: 'Membership', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'checkin', name: 'Check-in', icon: <Smartphone className="h-5 w-5" /> },
    { id: 'partners', name: 'Partners', icon: <MapPin className="h-5 w-5" /> },
    { id: 'corporate', name: 'Corporate', icon: <Users className="h-5 w-5" /> },
    { id: 'account', name: 'Account', icon: <Shield className="h-5 w-5" /> },
  ];

  const faqs = [
    {
      category: 'checkin',
      q: 'How do I check in at a partner location?',
      a: 'Simply log in to your HOPn account via the mobile app or web dashboard, navigate to the "Check-in" section, and generate your unique QR code. Show this QR code to the reception staff at any partner location. They will scan it to verify your membership and grant you access. The QR code refreshes every 60 seconds for security.',
    },
    {
      category: 'membership',
      q: 'Can I change my plan?',
      a: 'Yes! You can upgrade or downgrade your membership plan at any time. For individual memberships, visit your account settings and select "Change Plan". For corporate memberships, contact your HR administrator who manages plan changes for all employees. Plan changes take effect at the start of your next billing cycle.',
    },
    {
      category: 'membership',
      q: 'What happens if I exceed my monthly check-ins?',
      a: 'If you reach your monthly check-in limit, you have several options: purchase additional check-ins at a discounted rate (available in your dashboard), upgrade to a higher tier plan for unlimited access, or wait until your limit resets at the beginning of the next billing cycle. Bronze and Silver tier members can purchase check-in bundles of 5 or 10.',
    },
    {
      category: 'membership',
      q: 'Are there any hidden fees?',
      a: 'Absolutely not. The membership price includes all standard services at partner locations. You only pay extra for optional premium services like personal training sessions, specialized spa treatments, or additional check-ins beyond your plan limit. All fees are clearly displayed in your dashboard before purchase.',
    },
    {
      category: 'partners',
      q: 'Can I use my membership at any partner location?',
      a: 'You can use your membership at any approved partner facility whose category is included in your plan tier. Bronze members have access to gyms, Silver adds spas and wellness centers, Gold includes all facilities plus premium services, and Club+ gives you access to exclusive VIP locations. Check the Partners page or mobile app to see which locations are available for your tier.',
    },
    {
      category: 'corporate',
      q: 'How do I invite employees to join our corporate plan?',
      a: 'HR administrators can easily invite employees through the Company Portal. Navigate to "Employees" section, click "Invite Employees", and add their email addresses (you can bulk upload via CSV). Employees will receive an invitation email with instructions to create their account and start using their membership immediately.',
    },
    {
      category: 'membership',
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and bank transfers. Corporate accounts can also set up direct invoicing. All payments are securely processed with industry-standard encryption. You can save multiple payment methods in your account settings.',
    },
    {
      category: 'account',
      q: 'How do I cancel my membership?',
      a: 'We\'re sorry to see you go! You can cancel your membership anytime from your account settings under "Subscription". Click "Cancel Membership" and follow the prompts. Your access will continue until the end of your current billing period. For corporate memberships, contact your HR administrator.',
    },
    {
      category: 'checkin',
      q: 'Can I bring a guest?',
      a: 'Yes! Depending on your plan tier: Bronze members can purchase guest passes, Silver members get 2 complimentary guest passes per month, Gold members receive 5 per month, and Club+ members enjoy unlimited guest passes. Guest passes can be generated from your dashboard and are valid for one check-in.',
    },
    {
      category: 'partners',
      q: 'How often are new partners added?',
      a: 'We continuously expand our partner network. New facilities are added weekly across the region. You\'ll receive notifications about new partners in your area via email and the mobile app. You can also check the Partners page which is updated in real-time.',
    },
    {
      category: 'account',
      q: 'Is my personal information secure?',
      a: 'Absolutely. We use bank-level encryption (256-bit SSL) to protect all your data. Your personal information is never shared with third parties without your consent. We comply with international data protection regulations including GDPR. You can review our complete privacy policy in your account settings.',
    },
    {
      category: 'corporate',
      q: 'Can we customize our corporate plan?',
      a: 'Yes! Corporate plans are fully customizable based on your organization\'s needs. You can mix different tier levels for different departments, set custom check-in limits, add specific partner locations, and more. Contact our corporate sales team for a tailored proposal.',
    },
    {
      category: 'membership',
      q: 'Do you offer family plans?',
      a: 'Yes! Family plans are available with discounted rates for 2 or more family members. Each family member gets their own account with personalized access. Contact our support team or visit the Pricing page to learn more about family plan options and pricing.',
    },
    {
      category: 'checkin',
      q: 'What if the QR code doesn\'t scan?',
      a: 'If you experience scanning issues, try these steps: ensure your screen brightness is at maximum, clean your phone screen, or manually enter your membership ID shown below the QR code. If problems persist, contact the partner\'s reception staff who can verify your membership through our support line.',
    },
    {
      category: 'partners',
      q: 'Can I request a specific facility to become a partner?',
      a: 'Absolutely! We value member feedback. Submit partner requests through the "Suggest a Partner" form in your dashboard or mobile app. Include the facility name and location. We review all suggestions and prioritize based on member demand in specific areas.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
      <PublicNav />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about HOPn membership
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-primary-300'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="animate-fadeInUp"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <Card
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-primary-200"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-gray-900 flex-1 pr-4">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`h-6 w-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <Card className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </Card>
          )}
        </div>

        {/* Still Have Questions */}
        <div className="relative animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 rounded-2xl"></div>
          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 shadow-2xl text-center">
            <h2 className="text-3xl font-extrabold mb-4 text-white">Still have questions?</h2>
            <p className="text-lg text-white/90 mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`}>
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Contact Support
                </Button>
              </Link>
              <Link href={`/${locale}/pricing`}>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-primary-700 shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
