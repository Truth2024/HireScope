'use client';

import { Button, Input } from '@ui';

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
  buttonText = 'Search',
  className,
  initialValue = '',
}: SearchProps) => {
  const { value, setValue, handleSubmit } = useSearch({
    onSearch: handleSearch,
    initialValue,
    delay: 500,
  });

  return (
    <div className="flex items-center gap-3 w-full max-w-md">
      <Input
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        className={`${className} w-full`}
      />

      <Button onClick={handleSubmit} disabled={!value.trim()}>
        {buttonText}
      </Button>
    </div>
  );
};
