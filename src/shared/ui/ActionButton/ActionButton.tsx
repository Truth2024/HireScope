'use client';

import { Edit2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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
} as const;

export type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  action: keyof typeof icons;
  label?: string;
  showText?: 'always' | 'mobile-hidden' | 'desktop-only' | 'never';
  variant?: 'ghost' | 'outline' | 'solid';
  tone?: 'default' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  position?: 'default' | 'absolute';
  iconOnly?: boolean;
};

const sizeClasses = {
  sm: {
    button: 'px-2 py-1.5 text-xs',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    button: 'px-3 py-2 text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    button: 'px-4 py-2.5 text-base',
    icon: 'w-5 h-5',
  },
} as const;

const variantClasses = {
  ghost: {
    default: 'text-gray-500 hover:text-(--color-brand) hover:bg-(--color-brand)/5',
    danger: 'text-gray-500 hover:text-red-600 hover:bg-red-50',
    base: 'bg-transparent',
  },
  outline: {
    default:
      'text-gray-700 border-gray-200 hover:border-(--color-brand) hover:text-(--color-brand) hover:bg-(--color-brand)/5',
    danger: 'text-red-600 border-red-200 hover:border-red-600 hover:bg-red-50',
    base: 'bg-transparent border',
  },
  solid: {
    default: 'text-white bg-(--color-brand) hover:bg-(--color-brand-hover)',
    danger: 'text-white bg-red-600 hover:bg-red-700',
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
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const t = useTranslations('Card');
    const Icon = icons[action];
    const sizeStyle = sizeClasses[size];

    // Определяем тон в зависимости от действия (delete всегда danger)
    const finalTone = action === 'delete' ? 'danger' : tone;

    // Безопасно получаем стили
    const variantStyle = variantClasses[variant][finalTone];
    const baseStyle = variantClasses[variant].base;

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          positionClasses[position],
          'cursor-pointer inline-flex items-center justify-center',
          'font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyle.button,
          baseStyle,
          variantStyle,
          finalTone === 'danger' ? 'focus:ring-red-500/20' : 'focus:ring-(--color-brand)/20',
          iconOnly ? 'px-2' : 'px-3',
          className
        )}
        {...props}
      >
        <Icon className={cn(sizeStyle.icon, !iconOnly && 'mr-2')} />
        {!iconOnly && <span className={textClasses[showText]}>{label || t(action)}</span>}
      </button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
