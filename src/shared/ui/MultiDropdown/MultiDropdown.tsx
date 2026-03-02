import { debounce } from 'lodash';
import React from 'react';

import { Arrow, Input } from '@ui';

import styles from './multidropdown.module.scss';

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

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  value,
  getTitle,
  someError,
  onChange,
  disabled,
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const [isOpen, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  const updateDebouncedSearch = React.useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 300),
    []
  );

  React.useEffect(() => {
    return () => {
      updateDebouncedSearch.cancel();
    };
  }, [updateDebouncedSearch]);

  const handleOptionClick = (option: Option) => {
    const isSelected = value.some((item) => item.key === option.key);
    if (isSelected) {
      onChange(value.filter((item) => item.key !== option.key));
    } else {
      onChange([...value, option]);
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.value.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  React.useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        inputRef.current &&
        listRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !listRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, []);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateDebouncedSearch(val);
    setOpen(true);
  };

  const actualTitle = getTitle(value);
  const isValueEmpty = value.length === 0;
  let inputValue: string;
  let inputPlaceholder: string;

  if (isOpen) {
    inputValue = search;
    inputPlaceholder = actualTitle;
  } else {
    if (isValueEmpty) {
      inputValue = '';
      inputPlaceholder = actualTitle;
    } else {
      inputValue = actualTitle;
      inputPlaceholder = '';
    }
  }

  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleWrapperClick = () => {
    if (disabled) return;
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={handleWrapperClick}
      className={`${className} ${styles['wrapper-click']} ${someError ? styles.someError : ''}`}
    >
      <Input
        afterSlot={<Arrow dir="down" className="cursor-pointer" />}
        value={isOpen ? search : inputValue}
        placeholder={inputPlaceholder}
        onChange={handleSearchChange}
        onFocus={handleInputFocus}
        ref={inputRef}
        className={styles.input}
        disabled={disabled || someError}
      />

      {isOpen && !disabled && (
        <ul ref={listRef} className={`border border-gray-200 ${styles.list}`}>
          {filteredOptions.map((item) => {
            const isSelected = value.some((i) => i.key === item.key);
            return (
              <li
                key={item.key}
                onClick={() => handleOptionClick(item)}
                className={`cursor-pointer ${styles.item} ${isSelected ? styles.color : ''}`}
              >
                {item.value}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiDropdown;
