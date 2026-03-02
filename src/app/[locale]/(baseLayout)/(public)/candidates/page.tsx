import { getTranslations } from 'next-intl/server';

import type { IUser } from '@myTypes/mongoTypes';
import type { Option } from '@ui';
import { Section, SectionTitle } from '@ui';

import { CandidateClient } from './components/CandidatesClient/CandidatesClient';
import { candidatesServiceAll } from './services/candidatesService';

type CandidatesPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    skills?: string;
  }>;
};

export default async function CandidatesPage({ searchParams }: CandidatesPageProps) {
  const params = await searchParams;

  const pageParam = Number(params.page) || 1;
  const searchParam = params.search?.trim() || '';
  const skillsParam = params.skills?.split(',').filter(Boolean) || [];

  const selectedSkillOptions: Option[] = skillsParam.map((skill) => ({
    key: skill,
    value: skill,
  }));

  const { candidates, totalPages } = await candidatesServiceAll(
    pageParam,
    searchParam,
    skillsParam
  );

  const t = await getTranslations('SectionTitle');

  return (
    <div className="py-10">
      <Section>
        <SectionTitle title={t('candidates')} />
        <div className="content">
          <CandidateClient
            initialCandidates={candidates as IUser[]}
            totalPages={totalPages}
            currentPage={pageParam}
            search={searchParam}
            selectedSkills={selectedSkillOptions}
          />
        </div>
      </Section>
    </div>
  );
}
