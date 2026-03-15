'use client';

import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';

import { CandidatesFiltersBar } from '@candidatesComponents/CandidatesClient/components/CandidatesFiltersBar/CandidatesFiltersBar';
import { CandidatesList } from '@candidatesComponents/CandidatesList/CandidatesList';
import { useFilters } from '@candidatesProvider/filtersProvider';
import type { CandidateFilterState } from '@candidatesStore/CandidateFilterStore';
import { ApiError } from '@lib/error';
import { ErrorComponent } from '@ui';

export const CandidateClient = observer(() => {
  const filterStore = useFilters();
  const { filters } = filterStore;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'candidates',
      filters.page,
      filters.search,
      filters.hasExperience,
      filters.skills.join(','),
    ],

    queryFn: () => fetchCandidates(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (error) {
    if (error instanceof ApiError) {
      return (
        <div>
          <CandidatesFiltersBar />
          <ErrorComponent code={error.code} />
        </div>
      );
    }

    return (
      <div>
        <CandidatesFiltersBar />
        <ErrorComponent code={500} />
      </div>
    );
  }

  return (
    <div>
      <CandidatesFiltersBar />
      <CandidatesList
        candidates={data?.candidates || []}
        totalPages={data?.totalPages || 1}
        currentPage={filters.page}
        search={filters.search}
        loading={isLoading}
        onPageChange={filterStore.setPage}
      />
    </div>
  );
});

const fetchCandidates = async (filters: CandidateFilterState) => {
  const params = new URLSearchParams({
    page: String(filters.page),
    search: filters.search,
  });

  if (filters.skills.length) {
    params.set('skills', filters.skills.join(','));
  }

  if (filters.hasExperience) {
    params.set('hasExperience', 'true');
  }

  const response = await fetch(`/api/candidate?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Ошибка загрузки кандидатов', response.status);
  }

  return response.json();
};
