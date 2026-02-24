import { getTranslations } from 'next-intl/server';

import { CandidateCard } from '@components';
import { Section, SectionTitle } from '@ui';
import type { IUser } from 'src/shared/types/mongoTypes';

export default async function CandidatesPage() {
  const candidates = await fetchCandidates();
  const t = await getTranslations('SectionTitle');
  return (
    <div className="py-10">
      <Section>
        <SectionTitle title={t('candidates')} />
        <div className="content">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {candidates.map((item) => (
              <li key={item.id}>
                <CandidateCard candidate={item} />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}

const fetchCandidates = async (): Promise<IUser[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidate/`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    return [];
  }
};
