import type { Metadata } from 'next';

import { generatePageMetadata } from '@lib/generateMetadata';

import { CreateClient } from './CreateClient';
type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    namespace: 'vacancyCreate',
    path: '/profile/hr/vacancies/create',
    noIndex: true,
  });
}
export default function CreatePage() {
  return (
    <div className="pb-10">
      <CreateClient />
    </div>
  );
}
