import { Section, SectionTitle } from '@ui';
import type { IUser, IVacancy } from 'src/shared/types/mongoTypes';

import { Hero } from './components/Hero/Hero';
import Stories from './components/Stories/Stories';
import { TopCandidateList } from './components/TopCandidateList/TopCandidateList';
import { TopVacancyList } from './components/TopVacancyList/TopVacancyList';

export default async function MainPage() {
  const vacancy = await fetchTopVacancy();
  const candidate = await fetchNewCandidate();

  return (
    <div className="">
      <div className="flex flex-col min-h-[calc(100vh-80px)]">
        <Stories />
        <Hero />
      </div>

      <Section>
        <SectionTitle title={'Trending Jobs'} sectionBtn={'View all'} path={'/vacancies'} />
        <TopVacancyList vacancy={vacancy} />
      </Section>
      <Section>
        <SectionTitle title={'New Candidates'} sectionBtn={'View all'} path={'/candidates'} />
        <TopCandidateList newUsersCandidate={candidate} />
      </Section>
    </div>
  );
}

// Общая функция для fetch с обработкой ошибок
const fetchTopVacancy = async (): Promise<IVacancy[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vacancy/top`, {
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

// Общая функция для fetch с обработкой ошибок
const fetchNewCandidate = async (): Promise<IUser[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidate/newUsers`, {
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
