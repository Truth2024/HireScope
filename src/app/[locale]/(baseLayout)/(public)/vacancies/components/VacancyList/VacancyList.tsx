'use client';

import { observer } from 'mobx-react-lite';

import { VacancyCard } from '@components';
import type { IVacancy } from '@myTypes/mongoTypes';
import { EmptyList, Loader, Pagination } from '@ui';

type VacancyListProps = {
  vacancies: IVacancy[];

  totalPages: number;
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  search: string;
};

export const VacancyList = observer(
  ({ vacancies, totalPages, currentPage, loading, onPageChange }: VacancyListProps) => {
    return (
      <>
        {!loading && vacancies.length === 0 && <EmptyList type="vacancies" />}

        {loading && (
          <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center">
            <Loader />
          </div>
        )}

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 mb-10">
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
          />
        )}
      </>
    );
  }
);
