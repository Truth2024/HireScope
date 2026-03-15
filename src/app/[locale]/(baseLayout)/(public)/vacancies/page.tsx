import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { DEFAULT_VACANCIES_SORT } from '@constants/constants';
import { generatePageMetadata } from '@lib/generateMetadata';
import { ErrorComponent, Section, SectionTitle } from '@ui';

import { VacanciesClient } from './components/VacanciesClient/VacanciesClient';
import { vacanciesServiceAll } from './services/vacancyService';

type VacanciesPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    skills?: string;
    sort?: string;
  }>;
};
type Props = {
  params: Promise<{ locale: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    namespace: 'vacancies',
    path: '/vacancies',
  });
}
export default async function VacanciesPage({ searchParams }: VacanciesPageProps) {
  const t = await getTranslations('SectionTitle');
  const params = await searchParams;
  const queryClient = new QueryClient();
  const pageParam = Number(params.page) || 1;
  const searchParam = params.search?.trim() || '';
  const skillsParam = params.skills ? params.skills.split(',').filter(Boolean) : [];
  const sortParam = params.sort || DEFAULT_VACANCIES_SORT;

  const result = await vacanciesServiceAll(pageParam, searchParam, skillsParam, sortParam);

  if (result.status === 'error') {
    return <ErrorComponent code={result.code} />;
  }

  await queryClient.prefetchQuery({
    queryKey: ['vacancies', pageParam, searchParam, skillsParam.join(','), sortParam],
    queryFn: () =>
      Promise.resolve(
        result.status === 'success'
          ? result.data
          : {
              vacancies: [],
              total: 0,
              totalPages: 0,
              currentPage: pageParam,
            }
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="py-10">
      <Section>
        <SectionTitle title={t('vacancies')} />
        <div className="content">
          <HydrationBoundary state={dehydratedState}>
            <VacanciesClient
              pageParam={pageParam}
              searchParam={searchParam}
              skillsParam={skillsParam}
              sortParam={sortParam}
            />
          </HydrationBoundary>
        </div>
      </Section>
    </div>
  );
}
