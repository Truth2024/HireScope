'use client';

import { debounce } from 'lodash';
import { useState, useMemo, useEffect, useCallback } from 'react';

type UseSearchProps = {
  onSearch: (value: string) => void;
  initialValue?: string;
  delay?: number;
};

type UseSearchReturn = {
  value: string;
  setValue: (value: string) => void;
  handleSubmit: () => void;
  isSearching: boolean;
};

export const useSearch = ({
  onSearch,
  initialValue = '',
  delay = 500,
}: UseSearchProps): UseSearchReturn => {
  const [value, setValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const stableOnSearch = useCallback(
    (val: string) => {
      onSearch(val);
    },
    [onSearch]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setIsSearching(true);
        stableOnSearch(val);
        setTimeout(() => setIsSearching(false), 300);
      }, delay),
    [stableOnSearch, delay]
  );

  useEffect(() => {
    if (value === initialValue) {
      return;
    }
    debouncedSearch(value);

    return () => {
      debouncedSearch.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debouncedSearch]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;

    debouncedSearch.cancel();
    setIsSearching(true);
    stableOnSearch(trimmed);
    setTimeout(() => setIsSearching(false), 300);
  }, [value, debouncedSearch, stableOnSearch]);

  return {
    value,
    setValue,
    handleSubmit,
    isSearching,
  };
};
