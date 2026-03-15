import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { vacancyCandidatesService } from '@HRVacanciesServices/HRVacanciesServices';
import { VacancyCandidate } from '@HRVacancyCandidateComponents';
import { generatePageMetadata } from '@lib/generateMetadata';
import { EmptyList, ErrorComponent } from '@ui';

type CandidatesPageRouteProps = {
  params: Promise<{
    vacancyId: string;
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    hasExperience?: string;
    sortBy?: 'matchScore' | 'appliedAt';
    order?: 'desc' | 'asc';
  }>;
};

export async function generateMetadata({ params }: CandidatesPageRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return generatePageMetadata({
    locale,
    title: t('responses.simpleTitle'),
    description: t('responses.simpleDescription'),
    path: '/profile/hr/vacancies/[id]/candidates',
    noIndex: true,
  });
}

export default async function CandidatesPageRoute({
  params,
  searchParams,
}: CandidatesPageRouteProps) {
  const queryClient = new QueryClient();
  const { vacancyId } = await params;
  const sParams = await searchParams;

  const page = Number(sParams.page) || 1;
  const searchQuery = sParams.search || '';
  const hasExperience = sParams.hasExperience === 'true';
  const sortBy = sParams.sortBy || 'matchScore';
  const order = sParams.order || 'desc';

  const result = await vacancyCandidatesService(
    vacancyId,
    page,
    searchQuery,
    hasExperience,
    sortBy as 'matchScore' | 'appliedAt',
    order as 'asc' | 'desc'
  );

  if (result.status === 'unauthorized' || result.status === 'forbidden') {
    redirect('/');
  }

  if (result.status === 'notFound') {
    return <EmptyList type="candidatesHR" icon="candidatesHR" />;
  }

  if (result.status === 'error') {
    return <ErrorComponent code={result.code} />;
  }

  await queryClient.prefetchQuery({
    queryKey: ['vacancyCandidates', vacancyId, page, searchQuery, hasExperience, sortBy, order],
    queryFn: () => Promise.resolve(result.data),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VacancyCandidate
        vacancyId={vacancyId}
        initialPage={page}
        initialExperience={hasExperience}
        initialSearch={searchQuery}
        initialSortBy={sortBy}
        initialOrder={order}
      />
    </HydrationBoundary>
  );
}
