'use client';

import { CandidateCard } from '@components';
import type { IUser } from '@myTypes/mongoTypes';
import { EmptyList, Loader, Pagination } from '@ui';

type CandidatesListProps = {
  candidates: IUser[];

  totalPages: number;
  currentPage: number;
  search?: string;
  loading: boolean;
  onPageChange: (page: number) => void;
};

export const CandidatesList = ({
  candidates,
  totalPages,
  currentPage,
  loading,
  onPageChange,
}: CandidatesListProps) => {
  return (
    <div>
      {!loading && candidates.length == 0 && <EmptyList type="candidates" icon="candidate" />}

      {loading && (
        <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 mb-10">
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
          />
        </div>
      )}
    </div>
  );
};
