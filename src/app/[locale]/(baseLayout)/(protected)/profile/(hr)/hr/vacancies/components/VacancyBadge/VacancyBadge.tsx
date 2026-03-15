'use client';

import { useVacancyCandidatesCount } from '@hooks/useVacancyCandidatesCount';

export const VacancyBadgeClient = ({
  vacancyId,
  initialCount,
  className,
}: {
  vacancyId: string;
  initialCount: number;
  className?: string;
}) => {
  const { data: count, isLoading } = useVacancyCandidatesCount(vacancyId);

  const displayCount = isLoading ? initialCount : count;

  if (!displayCount) return null;

  return (
    <div className={className}>
      <span className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-full bg-(--color-brand) text-white">
        {displayCount}
        {isLoading && (
          <svg className="w-3 h-3 ml-1 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </span>
    </div>
  );
};
