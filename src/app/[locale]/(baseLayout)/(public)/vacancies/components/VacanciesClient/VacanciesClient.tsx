'use client';

import { observer } from 'mobx-react-lite';
import React from 'react';

import { FILTERS_CONFIG, DEFAULT_SORT } from '@constants/constants';
import type { IVacancy } from '@myTypes/mongoTypes';
import type { Option } from '@ui';
import { useVacancyFilters } from '@vacanciesHooks/useVacancyFilters';
import { useVacanciesStore } from '@vacanciesHooks/useVacancyStore';

import { VacancyList } from '../VacancyList/VacancyList';

import { FiltersBar } from './components/FiltersBar/FiltersBar';

type VacanciesClientProps = {
  initialVacancies: IVacancy[];
  total: number;
  totalPages: number;
  currentPage: number;
  initialSearch?: string;
  initialSkills?: string[];
  initialSort?: string;
};

export const VacanciesClient = observer(
  ({
    initialVacancies,
    total,
    totalPages,
    currentPage,
    initialSearch = '',
    initialSkills = [],
    initialSort = DEFAULT_SORT,
  }: VacanciesClientProps) => {
    const {
      search: urlSearch,
      page: urlPage,
      skillOptions: urlSkillOptions,
      sort: urlSort,
    } = useVacancyFilters();

    const initialSkillOptions = React.useMemo(
      () =>
        initialSkills.map((skillValue) => {
          const skill = FILTERS_CONFIG.skills.find((s) => s.value === skillValue);
          return {
            key: skill?.key || skillValue.toLowerCase().replace(/\s+/g, ''),
            value: skillValue,
          };
        }),
      [initialSkills]
    );

    const store = useVacanciesStore({
      initialVacancies,
      total,
      totalPages,
      currentPage,
      initialSearch,
      initialSkillOptions,
      initialSort,
    });

    React.useEffect(() => {
      if (
        urlSearch !== store.search ||
        urlPage !== store.currentPage ||
        JSON.stringify(urlSkillOptions.map((s: Option) => s.value)) !==
          JSON.stringify(store.selectedSkills.map((s: Option) => s.value)) ||
        urlSort !== store.sort
      ) {
        store.fetchVacancies(urlPage, urlSearch, urlSkillOptions, urlSort);
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearchChange = React.useCallback(
      (value: string) => store.setSearch(value),
      [store]
    );

    const handleSkillsChange = React.useCallback(
      (options: Option[]) => store.setSkills(options),
      [store]
    );

    const handleSortChange = React.useCallback(
      (option: Option) => store.setSort(option.key),
      [store]
    );

    const handlePageChange = React.useCallback((page: number) => store.setPage(page), [store]);

    const currentSortOption = React.useMemo(
      () =>
        FILTERS_CONFIG.sortOptions.find((opt) => opt.key === store.sort) ||
        FILTERS_CONFIG.sortOptions[0],
      [store.sort]
    );

    return (
      <div>
        <FiltersBar
          search={store.search}
          selectedSkills={store.selectedSkills}
          currentSortOption={currentSortOption}
          sortOptions={FILTERS_CONFIG.sortOptions}
          skillsOptions={FILTERS_CONFIG.skills}
          onSearchChange={handleSearchChange}
          onSkillsChange={handleSkillsChange}
          onSortChange={handleSortChange}
        />

        <VacancyList
          vacancies={store.vacancies}
          totalPages={store.totalPages}
          currentPage={store.currentPage}
          loading={store.loading}
          error={store.error}
          onPageChange={handlePageChange}
          search={store.search}
        />
      </div>
    );
  }
);
