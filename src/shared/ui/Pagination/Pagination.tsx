'use client';

import React from 'react';

import { cn } from '@lib/utils';
import { Arrow } from '@ui';

import { usePagination } from './hooks/usePagination';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // делаем обязательным
  className?: string;
  delta?: number;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  delta = 2,
}: PaginationProps) => {
  const { pages, goToPage, goToPrev, goToNext, canGoPrev, canGoNext } = usePagination({
    currentPage,
    totalPages,
    onPageChange,
    delta,
  });

  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex gap-2 flex-wrap justify-center', className)}>
      <button
        onClick={goToPrev}
        disabled={!canGoPrev}
        className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-2xl bg-white border border-gray-200 disabled:opacity-50 hover:bg-linear-to-r hover:from-(--color-brand)/60 hover:to-(--color-brand-hover)/60 transition flex items-center justify-center"
      >
        <Arrow dir="left" size={20} />
      </button>

      {pages.map((page, idx) =>
        page === 'dots' ? (
          <span key={`dots-${idx}`} className="px-3 py-1 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={cn(
              'cursor-pointer px-3 py-1 rounded-2xl border transition flex items-center justify-center font-semibold',
              page === currentPage
                ? 'bg-linear-to-r from-(--color-brand) to-(--color-brand-hover) text-white border-none shadow-lg'
                : 'bg-white border border-gray-200 hover:bg-linear-to-r hover:from-(--color-brand)/20 hover:to-(--color-brand-hover)/20'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={goToNext}
        disabled={!canGoNext}
        className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-2xl bg-white border border-gray-200 disabled:opacity-50 hover:bg-linear-to-r hover:from-(--color-brand)/60 hover:to-(--color-brand-hover)/60 transition flex items-center justify-center"
      >
        <Arrow dir="right" size={20} />
      </button>
    </div>
  );
};
