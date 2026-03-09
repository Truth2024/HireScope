import type { Metadata } from 'next';

import { generatePageMetadata } from '@lib/generateMetadata';

import { ProfileNavCandidate } from './components/ProfileNavCandidate/ProfileNavCandidate';
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

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <ProfileNavCandidate />

      {children}
    </div>
  );
}
