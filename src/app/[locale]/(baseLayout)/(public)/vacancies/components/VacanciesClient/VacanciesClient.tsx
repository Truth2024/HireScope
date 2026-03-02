'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { skills } from '@constants/constants';
import type { IVacancy } from '@myTypes/mongoTypes';
import type { Option } from '@ui';
import { MultiDropdown, Search } from '@ui';
import { VacanciesStore } from '@vacanciesStore';

import { VacancyList } from '../VacancyList/VacancyList';

type VacanciesClientProps = {
  initialVacancies: IVacancy[];
  total: number;
  totalPages: number;
  currentPage: number;
  initialSearch?: string;
  initialSkills?: string[];
};

export const VacanciesClient = observer(
  ({
    initialVacancies,
    total,
    totalPages,
    currentPage,
    initialSearch = '',
    initialSkills = [],
  }: VacanciesClientProps) => {
    const searchParams = useSearchParams();

    const initialSkillOptions: Option[] = initialSkills.map((skillValue) => {
      const skill = skills.find((s) => s.value === skillValue);
      return {
        key: skill?.key || skillValue.toLowerCase().replace(/\s+/g, ''),
        value: skillValue,
      };
    });

    const store = useLocalObservable(
      () =>
        new VacanciesStore({
          vacancies: initialVacancies,
          total,
          totalPages,
          currentPage,
          search: initialSearch,
          selectedSkills: initialSkillOptions,
        })
    );

    const t = useTranslations('Card');

    const skillOptions: Option[] = skills;

    React.useEffect(() => {
      const urlSearch = searchParams.get('search') || '';
      const urlPage = Number(searchParams.get('page')) || 1;
      const urlSkills = searchParams.get('skills')?.split(',').filter(Boolean) || [];

      const urlSkillOptions: Option[] = urlSkills.map((skillValue) => {
        const skill = skills.find((s) => s.value === skillValue);
        return {
          key: skill?.key || skillValue.toLowerCase().replace(/\s+/g, ''),
          value: skillValue,
        };
      });

      if (
        urlSearch !== store.search ||
        urlPage !== store.currentPage ||
        JSON.stringify(urlSkillOptions.map((s) => s.value)) !==
          JSON.stringify(store.selectedSkills.map((s) => s.value))
      ) {
        store.fetchVacancies(urlPage, urlSearch, urlSkillOptions);
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = React.useCallback(
      (value: string) => {
        store.setSearch(value);
      },
      [store]
    );

    const handleSkillsChange = React.useCallback(
      (options: Option[]) => {
        store.setSkills(options);
      },
      [store]
    );

    const handlePageChange = React.useCallback(
      (page: number) => {
        store.setPage(page);
      },
      [store]
    );

    return (
      <div>
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <Search
            placeholder={`${t('search')}...`}
            buttonText={t('search')}
            handleSearch={handleSearch}
            initialValue={store.search}
            className="flex-1"
          />

          <MultiDropdown
            options={skillOptions}
            value={store.selectedSkills}
            onChange={handleSkillsChange}
            getTitle={(value) =>
              value.length ? value.map((v) => v.value).join(', ') : 'Выберите требования'
            }
            className="w-full md:w-64"
          />
        </div>

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
