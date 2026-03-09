import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CandidateClient } from '@candidatesComponents/CandidatesClient/CandidatesClient';
import { FilterProvider } from '@candidatesProvider/filtersProvider';
import { generatePageMetadata } from '@lib/generateMetadata';
import { Section, SectionTitle } from '@ui';

import { candidatesServiceAll } from './services/candidatesService';

type CandidatesPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    skills?: string;
    hasExperience?: string;
  }>;
};

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    namespace: 'candidates',
    path: '/candidates',
  });
}

export default async function CandidatesPage({ searchParams }: CandidatesPageProps) {
  const params = await searchParams;
  const queryClient = new QueryClient();
  const pageParam = Number(params.page) || 1;
  const searchParam = params.search?.trim() || '';
  const skillsParam = params.skills?.split(',').filter(Boolean) || [];
  const hasExperienceParam = params.hasExperience === 'true';

  await queryClient.prefetchQuery({
    queryKey: ['candidates', pageParam, searchParam, skillsParam, hasExperienceParam],
    queryFn: () => candidatesServiceAll(pageParam, searchParam, skillsParam, hasExperienceParam),
  });

  const t = await getTranslations('SectionTitle');
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="py-10">
      <Section>
        <SectionTitle title={t('candidates')} />
        <div className="content">
          <FilterProvider
            initialState={{
              page: pageParam,
              search: searchParam,
              skills: skillsParam,
              hasExperience: hasExperienceParam,
            }}
          >
            <HydrationBoundary state={dehydratedState}>
              <CandidateClient />
            </HydrationBoundary>
          </FilterProvider>
        </div>
      </Section>
    </div>
  );
}
