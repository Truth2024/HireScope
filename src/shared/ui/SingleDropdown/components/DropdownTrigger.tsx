'use client';

import React from 'react';

import { cn } from '@lib/utils';
import { Arrow } from '@ui';

const COLORS = {
  // Основные цвета
  primary: '#6366f1',
  primaryShadow: 'rgba(99,102,241,0.15)',
  error: '#ef4444',
  errorShadow: 'rgba(239,68,68,0.15)',

  // Фоновые цвета
  bgPrimary: '#f9fafb',
  bgDisabled: '#f3f4f6',

  // Границы
  borderDefault: '#e5e7eb',
  borderHover: '#d1d5db',
  borderError: '#fecaca',
  borderErrorFocus: '#ef4444',

  // Текст
  textPlaceholder: '#9ca3af',
  textValue: '#111827',
  textDisabled: '#cbd5e1',

  // Оттенки серого для справки
  gray200: '#cbd5e1',
  gray300: '#9ca3af',
  gray700: '#374151',
  gray800: '#111827',
} as const;

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
}) => {
  const triggerStates = {
    open:
      isOpen &&
      !disabled &&
      `border-[${COLORS.primary}] shadow-[0_0_0_3px ${COLORS.primaryShadow}]`,
    error:
      someError &&
      `border-[${COLORS.borderError}] focus-within:border-[${COLORS.error}] focus-within:shadow-[0_0_0_3px ${COLORS.errorShadow}]`,
    errorOpen:
      someError && isOpen && `border-[${COLORS.error}] shadow-[0_0_0_3px ${COLORS.errorShadow}]`,
    disabled: disabled && `bg-[${COLORS.bgDisabled}] pointer-events-none`,
  };

  const textStates = {
    placeholder: !hasValue && !disabled && `text-[${COLORS.textPlaceholder}] font-light`,
    value: hasValue && !disabled && `text-[${COLORS.textValue}]`,
    disabled: disabled && `text-[${COLORS.textDisabled}]`,
  };

  const arrowStates = {
    open: isOpen && 'transform rotate-180',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        'flex items-center justify-between w-full px-3 rounded-lg transition-all duration-200 h-9 sm:h-11',
        'cursor-pointer select-none',

        !disabled && [
          `bg-[${COLORS.bgPrimary}] border border-[${COLORS.borderDefault}]`,
          `hover:border-[${COLORS.borderHover}]`,
          `focus-within:border-[${COLORS.primary}] focus-within:shadow-[0_0_0_3px ${COLORS.primaryShadow}]`,
        ],

        triggerStates
      )}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="dropdown-list"
      tabIndex={disabled ? -1 : 0}
    >
      <span className={cn('flex-1 text-base font-normal outline-none truncate', textStates)}>
        {displayTitle}
      </span>

      <Arrow
        dir="down"
        className={cn('shrink-0 ml-2 transition-transform duration-200', arrowStates)}
      />
    </div>
  );
};
