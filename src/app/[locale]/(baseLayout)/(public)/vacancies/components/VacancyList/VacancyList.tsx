'use client';

import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';

import { VacancyCard } from '@components';
import type { IVacancy } from '@myTypes/mongoTypes';
import { Loader, Pagination } from '@ui';

type VacancyListProps = {
  vacancies: IVacancy[];

  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  search: string;
};

export const VacancyList = observer(
  ({
    vacancies,

    totalPages,
    currentPage,
    loading,
    error,
    onPageChange,
    search,
  }: VacancyListProps) => {
    const t = useTranslations('Card');

    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
      <>
        {!loading && vacancies.length === 0 && (
          <div className="text-center py-10 text-gray-500">{t('notFoundVacancies')}</div>
        )}

        {loading && (
          <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center">
            <Loader />
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {vacancies.map((item) => (
            <li key={item.id}>
              <VacancyCard vacancy={item} />
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            search={search}
          />
        )}
      </>
    );
  }
);
