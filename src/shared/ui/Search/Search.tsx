'use client';

import { Input } from '@ui';

import { useSearch } from './hooks/useSearch';

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

  className,
  initialValue = '',
}: SearchProps) => {
  const { value, setValue } = useSearch({
    onSearch: handleSearch,
    initialValue,
  });

  return (
    <>
      <Input
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        className={`${className} w-full`}
      />
    </>
  );
};
