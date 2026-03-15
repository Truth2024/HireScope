'use client';

import React from 'react';

import { cn } from '@lib/utils';

import { DropdownList } from './components/DropdownList';
import { DropdownTrigger } from './components/DropdownTrigger';
import { useSingleDropdownOptions } from './hooks/useOptions';
import { useSingleDropdown } from './hooks/useSingleDropdown';

export type Option = {
  key: string;
  value: string;
};

type SingleDropdownProps = {
  className?: string;
  options: Option[];
  value?: Option | null;
  onChange: (option: Option) => void;
  disabled?: boolean;
  someError?: boolean;
  getTitle: (option?: Option) => string;
};

export const SingleDropdown = ({
  options,
  value,
  onChange,
  getTitle,
  className = '',
  disabled = false,
  someError = false,
}: SingleDropdownProps) => {
  const { isOpen, dropdownRef, toggleDropdown, closeDropdown } = useSingleDropdown();

  const { filteredOptions, handleSelect, isSelected } = useSingleDropdownOptions({
    options,
    value,
    onChange,
    onClose: closeDropdown,
  });

  const handleKeyDown = (e: React.KeyboardEvent, option?: Option) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (option) {
        handleSelect(option);
      } else {
        toggleDropdown();
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      toggleDropdown();
    }
  };

  const displayTitle = value ? getTitle(value) : getTitle();

  return (
    <div
      ref={dropdownRef}
      className={cn('relative w-full max-w-92', someError && 'text-red-500', className)}
      onKeyDown={handleKeyDown}
    >
      <DropdownTrigger
        isOpen={isOpen}
        disabled={disabled}
        someError={someError}
        onClick={toggleDropdown}
        displayTitle={displayTitle}
        hasValue={!!value}
      />

      {isOpen && !disabled && (
        <DropdownList
          options={filteredOptions}
          onSelect={handleSelect}
          onKeyDown={handleKeyDown}
          isSelected={isSelected}
        />
      )}
    </div>
  );
};
