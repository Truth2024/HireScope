'use client';

import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';

import { CandidatesFiltersBar } from '@candidatesComponents/CandidatesClient/components/CandidatesFiltersBar/CandidatesFiltersBar';
import { CandidatesList } from '@candidatesComponents/CandidatesList/CandidatesList';
import { useFilters } from '@candidatesProvider/filtersProvider';
import type { CandidateFilterState } from '@candidatesStore/CandidateFilterStore';

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

  return (
    <div>
      <CandidatesFiltersBar />
      {error && error.message}
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
    throw new Error('Ошибка загрузки кандидатов');
  }

  return response.json();
};
