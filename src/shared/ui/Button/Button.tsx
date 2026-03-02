'use client';

import clsx from 'clsx';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

type BaseProps = {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
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
  const baseStyles =
    'cursor-pointer inline-flex items-center justify-center h-11 px-5 rounded-2xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60';

  const variants = {
    primary: `
    bg-[var(--color-brand)]
    text-white
    hover:bg-[var(--color-brand-hover)]
    focus:ring-[var(--color-brand)]
  `,
    secondary: `
    text-white
    bg-white/15 
    backdrop-blur-sm
    border
    border-white/30
    transition-all
    duration-200
    hover:bg-white/25
    focus:ring-[var(--border-gray)]
  `,
    danger: `
    bg-red-600
    text-white
    hover:bg-red-700
    focus:ring-red-500
  `,
  };
  const classes = clsx(
    baseStyles,
    variants[variant],
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
