'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Arrow } from '@ui';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  search?: string;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  search,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(page));

    if (search?.trim()) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    onPageChange?.(page);
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages: (number | 'dots')[] = [];
    const delta = 2;
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (rangeStart > 2) pages.push('dots');

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (rangeEnd < totalPages - 1) pages.push('dots');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
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
            className={`cursor-pointer px-3 py-1 rounded-2xl border transition flex items-center justify-center font-semibold ${
              page === currentPage
                ? 'bg-linear-to-r from-(--color-brand) to-(--color-brand-hover) text-white border-none shadow-lg'
                : 'bg-white border border-gray-200 hover:bg-linear-to-r hover:from-(--color-brand)/20 hover:to-(--color-brand-hover)/20'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-2xl bg-white border border-gray-200 disabled:opacity-50 hover:bg-linear-to-r hover:from-(--color-brand)/60 hover:to-(--color-brand-hover)/60 transition flex items-center justify-center"
      >
        <Arrow dir="right" size={20} />
      </button>
    </div>
  );
};
