'use client';

import React from 'react';

import { cn } from '@lib/utils';
import { Arrow, Input } from '@ui';

import { useMultiDropdown } from './hooks/useMultiDropdown';

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[] | [];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  someError?: boolean;
  getTitle: (value: Option[]) => string;
};

const MultiDropdown = ({
  options,
  value,
  getTitle,
  someError,
  onChange,
  disabled,
  className,
}: MultiDropdownProps) => {
  const {
    isOpen,
    inputRef,
    listRef,
    inputValue,
    inputPlaceholder,
    filteredOptions,
    handleSearchChange,
    handleInputFocus,
    handleWrapperClick,
    handleOptionClick,
  } = useMultiDropdown({
    options,
    value,
    onChange,
    disabled,
    getTitle,
    searchDelay: 300,
  });

  return (
    <div
      onClick={handleWrapperClick}
      className={cn(
        'relative w-full max-w-92',
        someError && 'text-red-500 [&_input]:placeholder:text-red-400',
        className
      )}
    >
      <Input
        afterSlot={<Arrow dir="down" className="cursor-pointer" />}
        value={inputValue}
        placeholder={inputPlaceholder}
        onChange={handleSearchChange}
        onFocus={handleInputFocus}
        ref={inputRef}
        disabled={disabled || someError}
        className={cn(someError && 'border-red-300 focus:ring-red-200')}
      />

      {isOpen && !disabled && (
        <ul
          ref={listRef}
          className="
            absolute top-full left-0 w-full mt-2.5 max-h-48 overflow-y-auto overflow-x-hidden
            bg-white border border-gray-200 rounded-lg shadow-lg z-(--z-dropdown)
            hover:shadow-xl transition-shadow
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-400
            [&::-webkit-scrollbar-thumb]:rounded-full
          "
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item) => {
              const isSelected = value.some((i) => i.key === item.key);
              return (
                <li
                  key={item.key}
                  onClick={() => handleOptionClick(item)}
                  className={cn(
                    'h-12 px-3 py-3.5 cursor-pointer transition-colors hover:bg-gray-50',
                    isSelected ? 'text-indigo-600 font-medium' : 'text-gray-700'
                  )}
                >
                  {item.value}
                </li>
              );
            })
          ) : (
            <li className="h-12 px-3 py-3.5 text-gray-400 text-center">Ничего не найдено</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MultiDropdown;
