'use client';

import { useForm } from 'react-hook-form';
import { PublicNav } from '@/components/PublicNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: any) => {
    console.log('Contact form:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            {submitted && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                Thank you! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Name"
                {...register('name', { required: true })}
                required
              />
              <Input
                label="Email"
                type="email"
                {...register('email', { required: true })}
                required
              />
              <Input
                label="Subject"
                {...register('subject', { required: true })}
                required
              />
              <Textarea
                label="Message"
                rows={5}
                {...register('message', { required: true })}
                required
              />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card>
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <Mail className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">support@hopn.com</p>
                  <p className="text-gray-600">sales@hopn.com</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <Phone className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">+966 11 234 5678</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <MapPin className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Office</h3>
                  <p className="text-gray-600">King Fahd Road</p>
                  <p className="text-gray-600">Riyadh, Saudi Arabia</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
