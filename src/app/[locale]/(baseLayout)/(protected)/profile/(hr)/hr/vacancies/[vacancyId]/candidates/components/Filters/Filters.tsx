import { useTranslations } from 'next-intl';

import type { OptionSingle } from '@ui';
import { Search, Checkbox, SingleDropdown } from '@ui';

type SortOption = {
  key: string;
  value: string;
  sortBy: 'matchScore' | 'appliedAt';
  order: 'asc' | 'desc';
};

type FiltersProps = {
  search: string;
  hasExperience: boolean;
  sortBy: string;
  order: string;
  onSearch: (val: string) => void;
  onExperienceToggle: () => void;
  onSortChange: (sortBy: 'matchScore' | 'appliedAt', order: 'asc' | 'desc') => void;
};

export const Filters = ({
  search,
  hasExperience,
  sortBy,
  order,
  onSearch,
  onExperienceToggle,
  onSortChange,
}: FiltersProps) => {
  const t = useTranslations('Card');

  const localizedSortOptions: SortOption[] = [
    { key: 'best', value: t('sortBestMatch'), sortBy: 'matchScore', order: 'desc' },
    { key: 'worst', value: t('sortLowMatch'), sortBy: 'matchScore', order: 'asc' },
    { key: 'newest', value: t('sortNewest'), sortBy: 'appliedAt', order: 'desc' },
    { key: 'oldest', value: t('sortOldest'), sortBy: 'appliedAt', order: 'asc' },
  ];

  const currentOption =
    localizedSortOptions.find((opt) => opt.sortBy === sortBy && opt.order === order) ||
    localizedSortOptions[0];

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-70">
        <Search handleSearch={onSearch} placeholder={t('search')} initialValue={search} />
      </div>
      <Checkbox
        onChange={onExperienceToggle}
        checked={hasExperience}
        checkBoxSize="lg"
        label={t('withExp')}
      />
      <SingleDropdown
        options={localizedSortOptions}
        value={currentOption}
        onChange={(option: OptionSingle) => {
          const sortOpt = option as SortOption;
          onSortChange(sortOpt.sortBy, sortOpt.order);
        }}
        getTitle={(option) => option?.value || t('sortBy')}
        className="w-72"
      />
    </div>
  );
};
