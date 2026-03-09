'use client';

import { useLocalObservable } from 'mobx-react-lite';

import type { IVacancy } from '@myTypes/mongoTypes';
import type { Option } from '@ui';

import { VacanciesStore } from '../store/VacanciesStore';

type UseVacanciesStoreProps = {
  initialVacancies: IVacancy[];
  total: number;
  totalPages: number;
  currentPage: number;
  initialSearch: string;
  initialSkillOptions: Option[];
  initialSort: string;
};

export const useVacanciesStore = ({
  initialVacancies,
  total,
  totalPages,
  currentPage,
  initialSearch,
  initialSkillOptions,
  initialSort,
}: UseVacanciesStoreProps) => {
  const store = useLocalObservable(
    () =>
      new VacanciesStore({
        vacancies: initialVacancies,
        total,
        totalPages,
        currentPage,
        search: initialSearch,
        selectedSkills: initialSkillOptions,
        sort: initialSort,
      })
  );

  return store;
};
