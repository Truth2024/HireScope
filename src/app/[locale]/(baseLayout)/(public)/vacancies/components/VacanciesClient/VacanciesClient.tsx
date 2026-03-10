'use client';

import { useQuery } from '@tanstack/react-query';
import { observer, useLocalObservable } from 'mobx-react-lite';

import { FILTERS_CONFIG } from '@constants/constants';
import type { SortKey, VacanciesFilterState } from '@vacanciesStore';
import { VacanciesStore } from '@vacanciesStore';

import { VacancyList } from '../VacancyList/VacancyList';

import { FiltersBar } from './components/FiltersBar/FiltersBar';

export const VacanciesClient = observer(() => {
  const store = useLocalObservable(() => new VacanciesStore());

  const { filters } = store;

  const { data, isLoading, error } = useQuery({
    queryKey: ['vacancies', filters.page, filters.search, filters.skills.join(','), filters.sort],
    queryFn: () => fetchVacancies(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <FiltersBar
        search={filters.search}
        selectedSkills={filters.skills.map((value) => ({ key: value, value }))}
        currentSortOption={
          FILTERS_CONFIG.sortOptions.find((opt) => opt.key === filters.sort) ||
          FILTERS_CONFIG.sortOptions[0]
        }
        sortOptions={FILTERS_CONFIG.sortOptions}
        skillsOptions={FILTERS_CONFIG.skills}
        onReset={store.resetFilters}
        onSearchChange={store.setSearch}
        onSkillsChange={(options) => store.setSkills(options.map((o) => o.value))}
        onSortChange={(option) => store.setSort(option.key as SortKey)}
      />

      <VacancyList
        vacancies={data?.vacancies || []}
        totalPages={data?.totalPages || 1}
        currentPage={filters.page}
        search={filters.search}
        loading={isLoading}
        error={error instanceof Error ? error.message : null}
        onPageChange={store.setPage}
      />
    </div>
  );
});

export const fetchVacancies = async (filters: VacanciesFilterState) => {
  const params = new URLSearchParams({
    page: String(filters.page),
  });

  if (filters.search) params.set('search', filters.search);
  if (filters.skills.length) params.set('skills', filters.skills.join(','));
  if (filters.sort !== 'newest') params.set('sort', filters.sort);

  const res = await fetch(`/api/vacancy?${params}`);

  if (!res.ok) {
    throw new Error('Ошибка загрузки вакансий');
  }

  return res.json();
};
