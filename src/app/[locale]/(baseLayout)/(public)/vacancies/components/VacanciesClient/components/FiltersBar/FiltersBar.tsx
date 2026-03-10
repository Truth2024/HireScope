'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { MultiDropdown, ResetButton, Search, SingleDropdown } from '@ui';
import type { Option } from '@ui';

type FiltersBarProps = {
  search: string;
  selectedSkills: Option[];
  currentSortOption: Option;
  sortOptions: Option[];
  skillsOptions: Option[];
  onSearchChange: (value: string) => void;
  onSkillsChange: (options: Option[]) => void;
  onSortChange: (option: Option) => void;
  onReset: () => void;
};

export const FiltersBar: React.FC<FiltersBarProps> = ({
  search,
  selectedSkills,
  currentSortOption,
  sortOptions,
  skillsOptions,
  onSearchChange,
  onSkillsChange,
  onSortChange,
  onReset,
}) => {
  const t = useTranslations('Card');

  const localizedSortOptions = React.useMemo(
    () =>
      sortOptions.map((opt) => ({
        ...opt,
        value: t(opt.value),
      })),
    [t, sortOptions]
  );

  const localizedCurrentOption = React.useMemo(() => {
    return {
      ...currentSortOption,
      value: t(currentSortOption.value),
    };
  }, [t, currentSortOption]);

  return (
    <div className="mb-10 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <div className="w-full flex-1 flex items-center gap-2">
          <Search
            placeholder={`${t('search')}...`}
            buttonText={t('search')}
            handleSearch={onSearchChange}
            initialValue={search}
            className="flex-1 min-w-75"
          />
          <ResetButton onClick={onReset} />
        </div>

        <MultiDropdown
          options={skillsOptions}
          value={selectedSkills}
          onChange={onSkillsChange}
          getTitle={(value) =>
            value.length ? value.map((v) => v.value).join(', ') : t('selectRequirements')
          }
          className="w-75"
        />

        <SingleDropdown
          options={localizedSortOptions}
          value={localizedCurrentOption}
          onChange={onSortChange}
          getTitle={(option) => option?.value || ''}
          className="w-75"
        />
      </div>
    </div>
  );
};
