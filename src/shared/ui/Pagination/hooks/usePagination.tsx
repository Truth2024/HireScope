'use client';

import { useCallback, useMemo } from 'react';

type UsePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // только callback, без URL
  delta?: number;
};

type UsePaginationReturn = {
  pages: (number | 'dots')[];
  goToPage: (page: number) => void;
  goToPrev: () => void;
  goToNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
};

export const usePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  delta = 2,
}: UsePaginationProps): UsePaginationReturn => {
  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      onPageChange(page); // просто вызываем callback, без навигации
    },
    [totalPages, onPageChange]
  );

  const goToPrev = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const goToNext = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const pages = useMemo(() => {
    const pagesArray: (number | 'dots')[] = [];
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pagesArray.push(1);
    if (rangeStart > 2) pagesArray.push('dots');

    for (let i = rangeStart; i <= rangeEnd; i++) pagesArray.push(i);

    if (rangeEnd < totalPages - 1) pagesArray.push('dots');
    if (totalPages > 1) pagesArray.push(totalPages);

    return pagesArray;
  }, [currentPage, totalPages, delta]);

  return {
    pages,
    goToPage,
    goToPrev,
    goToNext,
    canGoPrev,
    canGoNext,
  };
};
