import React from 'react';

import styles from './input.module.scss';
export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  type?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { value, onChange, afterSlot, className, onClick, disabled = false, type = 'text', ...props },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className={`${styles.inputWrapper} ${className}`} onClick={onClick}>
        <input
          ref={ref}
          className={`${styles.input} ${disabled ? styles.disabled : ''}`}
          type={type}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />

        {afterSlot}
      </div>
    );
  }
);
export default Input;
