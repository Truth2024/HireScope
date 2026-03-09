import { getTranslations } from 'next-intl/server';

import { Section, SectionTitle } from '@ui';

import { Hero } from './components/Hero/Hero';
import Stories from './components/Stories/Stories';
import { TopCandidateList } from './components/TopCandidateList/TopCandidateList';
import { TopVacancyList } from './components/TopVacancyList/TopVacancyList';
import { fetchTopCandidates, fetchTopVacancy } from './services/topVacancyAndCandidate';

export default async function MainPage() {
  const [candidates, vacancies] = await Promise.all([fetchTopCandidates(), fetchTopVacancy()]);

  const t = await getTranslations('SectionTitle');

  return (
    <div>
      <div className="flex flex-col min-h-[calc(100vh-80px)]">
        <Stories />
        <Hero />
      </div>

      <Section>
        <SectionTitle title={t('trendingJobs')} sectionBtn={t('buttonviewall')} path="/vacancies" />
        <TopVacancyList vacancy={vacancies} />
      </Section>

      <Section>
        <SectionTitle
          title={t('newcandidate')}
          sectionBtn={t('buttonviewall')}
          path="/candidates"
        />
        <TopCandidateList newUsersCandidate={candidates} />
      </Section>
    </div>
  );
}
