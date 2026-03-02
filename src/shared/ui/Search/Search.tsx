'use client';

import { debounce } from 'lodash';
import { useState, useMemo, useEffect, useCallback } from 'react';

import { Button, Input } from '@ui';

type SearchProps = {
  handleSearch: (value: string) => void;
  placeholder?: string;
  buttonText?: string;
  loading?: boolean;
  className?: string;
  initialValue?: string;
};

export const Search = ({
  handleSearch,
  placeholder = 'Search...',
  buttonText = 'Search',
  loading = false,
  className,
  initialValue = '',
}: SearchProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const stableHandleSearch = useCallback(
    (val: string) => {
      handleSearch(val);
    },
    [handleSearch]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        stableHandleSearch(val);
      }, 500),
    [stableHandleSearch]
  );

  useEffect(() => {
    debouncedSearch(value);

    return () => {
      debouncedSearch.cancel();
    };
  }, [value, debouncedSearch]);

  const onSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    debouncedSearch.cancel();
    stableHandleSearch(trimmed);
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-md">
      <Input
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        className={`${className} w-full`}
      />

      <Button onClick={onSubmit} loading={loading} disabled={!value.trim()}>
        {buttonText}
      </Button>
    </div>
  );
};
