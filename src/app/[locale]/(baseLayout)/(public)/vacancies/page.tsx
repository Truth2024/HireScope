import { Section, SectionTitle } from '@ui';

import { VacanciesClient } from './components/VacanciesClient/VacanciesClient';
import { vacanciesServiceAll } from './services/vacancyService';

type VacanciesPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    skills?: string;
  }>;
};

export default async function VacanciesPage({ searchParams }: VacanciesPageProps) {
  const params = await searchParams;

  const pageParam = Number(params.page) || 1;
  const searchParam = params.search?.trim() || '';
  const skillsParam = params.skills ? params.skills.split(',').filter(Boolean) : [];

  const data = await vacanciesServiceAll(pageParam, searchParam, skillsParam);

  return (
    <div className="py-10">
      <Section>
        <SectionTitle title="Vacancies" />
        <div className="content">
          <VacanciesClient
            initialVacancies={data.vacancies}
            total={data.total}
            totalPages={data.totalPages}
            currentPage={data.currentPage}
            initialSearch={searchParam}
            initialSkills={skillsParam}
          />
        </div>
      </Section>
    </div>
  );
}
