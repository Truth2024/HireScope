'use client';

import { useState, useCallback } from 'react';

import type { Option } from '../SingleDropdown';

type UseSingleDropdownOptionsProps = {
  options: Option[];
  value?: Option | null;
  onChange: (option: Option) => void;
  onClose?: () => void;
};

export const useSingleDropdownOptions = ({
  options,
  value,
  onChange,
  onClose,
}: UseSingleDropdownOptionsProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = searchTerm
    ? options.filter((opt) => opt.value.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const handleSelect = useCallback(
    (option: Option) => {
      onChange(option);
      onClose?.();
      setSearchTerm('');
    },
    [onChange, onClose]
  );

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const isSelected = useCallback(
    (option: Option) => {
      return value?.key === option.key;
    },
    [value]
  );

  const getDisplayTitle = useCallback(() => {
    return value ? value.value : '';
  }, [value]);

  return {
    filteredOptions,
    searchTerm,
    handleSelect,
    handleSearch,
    isSelected,
    getDisplayTitle,
  };
};
