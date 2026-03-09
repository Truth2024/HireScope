'use client';

import { useTranslations } from 'next-intl';

import { CandidateCard } from '@components';
import type { IUser } from '@myTypes/mongoTypes';
import { Loader, Pagination } from '@ui';

type CandidatesListProps = {
  candidates: IUser[];

  totalPages: number;
  currentPage: number;
  search: string;
  loading: boolean;
  onPageChange: (page: number) => void;
};

export const CandidatesList = ({
  candidates,
  totalPages,
  currentPage,
  search,
  loading,
  onPageChange,
}: CandidatesListProps) => {
  const t = useTranslations('Card');

  return (
    <div>
      {!loading && candidates.length === 0 && (
        <div className="text-center py-10 text-gray-500">{t('notFoundCandidates')}</div>
      )}

      {loading && (
        <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,317px))] gap-4 justify-start">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            search={search}
          />
        </div>
      )}
    </div>
  );
};
