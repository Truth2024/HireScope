import React from 'react';

import { cn } from '@lib/utils';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  type?: string;
  height?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      afterSlot,
      className,
      onClick,
      disabled = false,
      type = 'text',
      height = 'h-11',
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div
        className={cn(
          'flex items-center justify-between w-full px-3 rounded-lg transition-all duration-200',
          height,

          !disabled && [
            'bg-[#f9fafb] border border-[#e5e7eb]',
            'hover:border-[#d1d5db]',
            'focus-within:border-[#6366f1] focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
          ],
          disabled && 'bg-[#f3f4f6] pointer-events-none',
          className
        )}
        onClick={onClick}
      >
        <input
          ref={ref}
          className={cn(
            'w-full h-full bg-transparent text-base font-normal text-[#111827] outline-none',
            'placeholder:text-[#9ca3af] placeholder:font-light',
            disabled && 'text-[#cbd5e1] placeholder:text-[#cbd5e1]'
          )}
          type={type}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />

        {afterSlot && <div className="shrink-0 ml-2">{afterSlot}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
