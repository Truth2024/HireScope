'use client';

import React from 'react';

import { cn } from '@lib/utils';

import type { Option } from '../SingleDropdown';

type DropdownListProps = {
  options: Option[];
  onSelect: (option: Option) => void;
  onKeyDown: (e: React.KeyboardEvent, option?: Option) => void;
  isSelected: (option: Option) => boolean;
};

export const DropdownList: React.FC<DropdownListProps> = ({
  options,
  onSelect,
  onKeyDown,
  isSelected,
}) => (
  <ul
    className="
      absolute top-full left-0 w-full mt-2.5 max-h-48 overflow-y-auto overflow-x-hidden
      bg-white border border-gray-200 rounded-lg shadow-lg z-(--z-dropdown)
      hover:shadow-xl transition-shadow
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:bg-gray-400
      [&::-webkit-scrollbar-thumb]:rounded-full
    "
    role="listbox"
  >
    {options.length > 0 ? (
      options.map((option) => {
        const selected = isSelected(option);
        return (
          <li
            key={option.key}
            onClick={() => onSelect(option)}
            onKeyDown={(e) => onKeyDown(e, option)}
            className={cn(
              'h-12 px-3 py-3.5 cursor-pointer transition-colors hover:bg-gray-50',
              'focus:outline-none focus:bg-gray-50',
              selected ? 'text-indigo-600 font-medium' : 'text-gray-700'
            )}
            role="option"
            aria-selected={selected}
            tabIndex={0}
          >
            {option.value}
          </li>
        );
      })
    ) : (
      <li className="h-12 px-3 py-3.5 text-gray-400 text-center" role="status">
        Ничего не найдено
      </li>
    )}
  </ul>
);
