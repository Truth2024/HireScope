import { getTranslations } from 'next-intl/server';

import { EmptyList, Section, SectionTitle } from '@ui';

import { Hero, Stories, TopCandidateList, TopVacancyList } from './components';
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
        {vacancies.length === 0 ? (
          <EmptyList type="vacancies" />
        ) : (
          <TopVacancyList vacancy={vacancies} />
        )}
      </Section>

      <Section>
        <SectionTitle
          title={t('newcandidate')}
          sectionBtn={t('buttonviewall')}
          path="/candidates"
        />
        {candidates.length === 0 ? (
          <EmptyList type="candidates" icon="candidate" />
        ) : (
          <TopCandidateList newUsersCandidate={candidates} />
        )}
      </Section>
    </div>
  );
}
