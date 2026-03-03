'use client';

import { debounce } from 'lodash';
import { useState, useMemo, useEffect, useRef } from 'react';

import type { Option } from '@ui';

type UseMultiDropdownProps = {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
  searchDelay?: number;
};

type UseMultiDropdownReturn = {
  search: string;
  debouncedSearch: string;
  handleSearchChange: (val: string) => void;

  isOpen: boolean;
  setOpen: (open: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLUListElement | null>;
  handleInputFocus: () => void;
  handleWrapperClick: () => void;

  inputValue: string;
  inputPlaceholder: string;

  filteredOptions: Option[];
  handleOptionClick: (option: Option) => void;
};

export const useMultiDropdown = ({
  options,
  value,
  onChange,
  disabled,
  getTitle,
  searchDelay = 300,
}: UseMultiDropdownProps): UseMultiDropdownReturn => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const updateDebouncedSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), searchDelay),
    [searchDelay]
  );

  useEffect(() => {
    return () => {
      updateDebouncedSearch.cancel();
    };
  }, [updateDebouncedSearch]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateDebouncedSearch(val);
  };

  const [isOpen, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        inputRef.current &&
        listRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !listRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, []);

  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleWrapperClick = () => {
    if (disabled) return;
    inputRef.current?.focus();
  };

  const filteredOptions = options.filter((opt) =>
    opt.value.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleOptionClick = (option: Option) => {
    const isSelected = value.some((item) => item.key === option.key);
    if (isSelected) {
      onChange(value.filter((item) => item.key !== option.key));
    } else {
      onChange([...value, option]);
    }
  };

  const actualTitle = getTitle(value);
  const isValueEmpty = value.length === 0;

  let inputValue: string;
  let inputPlaceholder: string;

  if (isOpen) {
    inputValue = search;
    inputPlaceholder = actualTitle;
  } else {
    if (isValueEmpty) {
      inputValue = '';
      inputPlaceholder = actualTitle;
    } else {
      inputValue = actualTitle;
      inputPlaceholder = '';
    }
  }

  return {
    search,
    debouncedSearch,
    handleSearchChange,
    isOpen,
    setOpen,
    inputRef,
    listRef,
    handleInputFocus,
    handleWrapperClick,
    inputValue,
    inputPlaceholder,
    filteredOptions,
    handleOptionClick,
  };
};
