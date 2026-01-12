import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fitpass HOPn',
  description: 'B2B2C wellness membership platform - Employee wellness & fitness access',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
