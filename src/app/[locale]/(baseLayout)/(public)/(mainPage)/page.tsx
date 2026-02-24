import { getTranslations } from 'next-intl/server';

import { Section, SectionTitle } from '@ui';
import type { IUser, IVacancy } from 'src/shared/types/mongoTypes';

import { Hero } from './components/Hero/Hero';
import Stories from './components/Stories/Stories';
import { TopCandidateList } from './components/TopCandidateList/TopCandidateList';
import { TopVacancyList } from './components/TopVacancyList/TopVacancyList';

export default async function MainPage() {
  const [vacancy, candidate] = await Promise.all([fetchTopVacancy(), fetchNewCandidate()]);
  const t = await getTranslations('SectionTitle');
  return (
    <div className="">
      <div className="flex flex-col min-h-[calc(100vh-80px)]">
        <Stories />
        <Hero />
      </div>

      <Section>
        <SectionTitle
          title={t('trendingJobs')}
          sectionBtn={t('buttonviewall')}
          path={'/vacancies'}
        />
        <TopVacancyList vacancy={vacancy} />
      </Section>
      <Section>
        <SectionTitle
          title={t('newcandidate')}
          sectionBtn={t('buttonviewall')}
          path={'/candidates'}
        />
        <TopCandidateList newUsersCandidate={candidate} />
      </Section>
    </div>
  );
}

const fetchTopVacancy = async (): Promise<IVacancy[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vacancy/top`, {
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

const fetchNewCandidate = async (): Promise<IUser[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidate/newUsers`, {
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
