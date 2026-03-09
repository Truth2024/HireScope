'use client';

import { Edit2, Plus, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@lib/utils';

const icons = {
  edit: Edit2,
  add: Plus,
  delete: Trash2,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  check: Check,
} as const;

export type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  action: keyof typeof icons;
  label?: string;
  showText?: 'always' | 'mobile-hidden' | 'desktop-only' | 'never';
  variant?: 'ghost' | 'outline' | 'solid';
  tone?: 'default' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  position?: 'default' | 'absolute';
  iconOnly?: boolean;
  isLoading?: boolean;
  loadingText?: string;
};

const sizeClasses = {
  sm: {
    button: 'px-2 py-1.5 text-xs',
    icon: 'w-3.5 h-3.5',
    loader: 'w-3.5 h-3.5',
  },
  md: {
    button: 'px-3 py-2 text-sm',
    icon: 'w-4 h-4',
    loader: 'w-4 h-4',
  },
  lg: {
    button: 'px-4 py-2.5 text-base',
    icon: 'w-5 h-5',
    loader: 'w-5 h-5',
  },
} as const;

const variantClasses = {
  ghost: {
    default: 'text-gray-500 hover:text-(--color-brand) hover:bg-(--color-brand)/5',
    danger: 'text-gray-500 hover:text-red-600 hover:bg-red-50',
    success: 'text-gray-500 hover:text-green-600 hover:bg-green-50',
    base: 'bg-transparent',
  },
  outline: {
    default:
      'text-gray-700 border-gray-200 hover:border-(--color-brand) hover:text-(--color-brand) hover:bg-(--color-brand)/5',
    danger: 'text-red-600 border-red-200 hover:border-red-600 hover:bg-red-50',
    success: 'text-green-600 border-green-200 hover:border-green-600 hover:bg-green-50',
    base: 'bg-transparent border',
  },
  solid: {
    default: 'text-white bg-(--color-brand) hover:bg-(--color-brand-hover)',
    danger: 'text-white bg-red-600 hover:bg-red-700',
    success: 'text-white bg-green-600 hover:bg-green-700',
    base: '',
  },
} as const;

const positionClasses = {
  default: 'relative',
  absolute: 'absolute -right-2 -top-2',
} as const;

const textClasses = {
  always: 'ml-2',
  'mobile-hidden': 'sr-only md:not-sr-only md:ml-2',
  'desktop-only': 'hidden md:inline md:ml-2',
  never: 'sr-only',
} as const;

// Компонент лоадера
const LoaderIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      className,
      action,
      label,
      showText = 'always',
      variant = 'ghost',
      tone = 'default',
      size = 'md',
      position = 'default',
      iconOnly = false,
      isLoading = false,
      loadingText,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const t = useTranslations('Card');
    const Icon = icons[action];
    const sizeStyle = sizeClasses[size];

    // Определяем тон в зависимости от действия
    let finalTone = tone;
    if (action === 'delete') finalTone = 'danger';
    if (action === 'check') finalTone = 'success';

    // Безопасно получаем стили
    const variantStyle = variantClasses[variant][finalTone];
    const baseStyle = variantClasses[variant].base;

    // Определяем цвет фокуса
    const focusRingClass =
      finalTone === 'danger'
        ? 'focus:ring-red-500/20'
        : finalTone === 'success'
          ? 'focus:ring-green-500/20'
          : 'focus:ring-(--color-brand)/20';

    // Текст для отображения (либо loadingText, либо обычный label)
    const displayText = isLoading && loadingText ? loadingText : label || t(action);

    return (
      <button
        ref={ref}
        type="button"
        onClick={isLoading ? undefined : onClick}
        disabled={disabled || isLoading}
        className={cn(
          positionClasses[position],
          'cursor-pointer inline-flex items-center justify-center',
          'font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyle.button,
          baseStyle,
          variantStyle,
          focusRingClass,
          iconOnly ? 'px-2' : 'px-3',
          isLoading && 'cursor-wait',
          className
        )}
        aria-disabled={isLoading}
        aria-label={iconOnly ? displayText : undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <LoaderIcon className={cn(sizeStyle.loader, !iconOnly && 'mr-2')} />
            {!iconOnly && <span className={textClasses[showText]}>{displayText}</span>}
          </>
        ) : (
          <>
            <Icon className={cn(sizeStyle.icon, !iconOnly && 'mr-2')} />
            {!iconOnly && <span className={textClasses[showText]}>{displayText}</span>}
          </>
        )}
      </button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
