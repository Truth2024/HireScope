'use client';

import React from 'react';

import { cn } from '@lib/utils';
import { Arrow } from '@ui';

type DropdownTriggerProps = {
  isOpen: boolean;
  disabled: boolean;
  someError: boolean;
  onClick: () => void;
  displayTitle: string;
  hasValue: boolean;
};

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
  isOpen,
  disabled,
  someError,
  onClick,
  displayTitle,
  hasValue,
}) => (
  <div
    onClick={!disabled ? onClick : undefined}
    className={cn(
      'flex items-center justify-between w-full px-3 rounded-lg transition-all duration-200 h-11',
      'cursor-pointer select-none',

      !disabled && [
        'bg-[#f9fafb] border border-[#e5e7eb]',
        'hover:border-[#d1d5db]',
        'focus-within:border-[#6366f1] focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
      ],

      isOpen && !disabled && 'border-[#6366f1] shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',

      disabled && 'bg-[#f3f4f6] pointer-events-none',

      someError &&
        'border-red-300 focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',

      someError && isOpen && 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
    )}
    role="combobox"
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-controls="dropdown-list"
    tabIndex={disabled ? -1 : 0}
  >
    <span
      className={cn(
        'flex-1 text-base font-normal outline-none truncate',
        !hasValue ? 'text-[#9ca3af] font-light' : 'text-[#111827]',
        disabled && 'text-[#cbd5e1]'
      )}
    >
      {displayTitle}
    </span>

    <Arrow
      dir="down"
      className={cn(
        'shrink-0 ml-2 transition-transform duration-200',
        isOpen && 'transform rotate-180'
      )}
    />
  </div>
);
