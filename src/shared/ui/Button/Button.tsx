'use client';

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { cn } from '@lib/utils';

type BaseProps = {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'cancel';
  fullWidth?: boolean;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkProps = BaseProps & {
  href: string;
  target?: string;
};

type Props = ButtonProps | LinkProps;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>((props, ref) => {
  const {
    children,
    className,
    loading = false,
    disabled = false,
    variant = 'primary',
    fullWidth = false,
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  const classes = cn(
    'cursor-pointer inline-flex items-center justify-center h-9 sm:h-11 px-3 sm:px-5 rounded-2xl',
    'text-sm sm:text-base font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-60',

    variant === 'primary' && [
      'bg-[var(--color-brand)] text-white',
      'hover:bg-[var(--color-brand-hover)]',
      'focus:ring-[var(--color-brand)]',
    ],
    variant === 'secondary' && [
      'text-white bg-white/15 backdrop-blur-sm',
      'border border-white/30',
      'transition-all duration-200',
      'hover:bg-white/25',
      'focus:ring-[var(--border-gray)]',
    ],
    variant === 'danger' && ['bg-red-600 text-white', 'hover:bg-red-700', 'focus:ring-red-500'],
    variant === 'cancel' && [
      'bg-transparent text-gray-700',
      'border-2 border-gray-200',
      'hover:bg-gray-50 hover:border-gray-300',
      'focus:ring-gray-400',
      'active:bg-gray-100',
    ],
    fullWidth && 'w-full',
    isDisabled && 'cursor-not-allowed opacity-70',

    className
  );

  if ('href' in props && props.href) {
    return (
      <Link
        href={props.href}
        target={props.target}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        aria-disabled={isDisabled}
        onClick={(e) => {
          if (isDisabled) e.preventDefault();
        }}
      >
        {loading ? 'Loading...' : children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
