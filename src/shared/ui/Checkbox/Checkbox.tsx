'use client';

import React from 'react';

import { cn } from '@lib/utils';

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> & {
  /** Текст рядом с чекбоксом */
  label?: string;
  /** Callback при изменении */
  onChange?: (checked: boolean) => void;
  /** Размер чекбокса */
  checkBoxSize?: 'sm' | 'md' | 'lg';
  /** Есть ли ошибка */
  error?: boolean;
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const iconSizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  onChange,
  className,
  disabled = false,
  checkBoxSize = 'md',
  error = false,
  checked,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  const sizeKey = checkBoxSize as 'sm' | 'md' | 'lg';
  const iconSizeKey = checkBoxSize as 'sm' | 'md' | 'lg';

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />

        <div
          className={cn(
            sizeClasses[sizeKey],
            'rounded border transition-all duration-200',
            'flex items-center justify-center',

            !disabled && [
              'bg-[#f9fafb] border-[#e5e7eb]',
              'hover:border-[#d1d5db]',
              'focus-within:ring-2 focus-within:ring-[#6366f1] focus-within:ring-opacity-50',
            ],

            checked &&
              !disabled &&
              'bg-[#6366f1] border-[#6366f1] hover:bg-[#4f46e5] hover:border-[#4f46e5]',

            checked && error && 'bg-red-500 border-red-500',

            error && !checked && 'border-red-300',

            disabled && checked && 'bg-[#9ca3af] border-[#9ca3af]',

            disabled && !checked && 'bg-[#f3f4f6] border-[#e5e7eb]'
          )}
        >
          {checked && (
            <svg
              className={cn('text-white', iconSizes[iconSizeKey])}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {label && (
        <span className={cn('text-sm font-normal', disabled ? 'text-[#cbd5e1]' : 'text-[#111827]')}>
          {label}
        </span>
      )}
    </label>
  );
};
