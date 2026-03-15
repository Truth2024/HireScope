import type { Metadata } from 'next';

import { generatePageMetadata } from '@lib/generateMetadata';

import { ProfileNavHR } from './components/ProfileNavHR';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    namespace: 'profile',
    path: '/profile',
  });
}

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <ProfileNavHR />

      {children}
    </div>
  );
}
