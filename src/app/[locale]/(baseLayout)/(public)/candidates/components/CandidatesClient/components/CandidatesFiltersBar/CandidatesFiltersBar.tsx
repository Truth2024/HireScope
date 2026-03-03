'use client';

import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';

import { useFilters } from '@candidatesProvider/filtersProvider';
import { CANDIDATES_CONFIG } from '@constants/constants';
import { MultiDropdown, Search, Checkbox } from '@ui';
import type { Option } from '@ui';

export const CandidatesFiltersBar = observer(() => {
  const t = useTranslations('Card');
  const filterStore = useFilters();
  const { filters } = filterStore;

  const selectedSkills: Option[] = filters.skills.map((skill) => ({
    key: skill,
    value: skill,
  }));

  const handleSkillsChange = (options: Option[]) => {
    const skillStrings = options.map((opt) => String(opt.value));
    filterStore.setSkills(skillStrings);
  };

  return (
    <div className="mb-10 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Search
          placeholder={`${t('search')}...`}
          buttonText={t('search')}
          handleSearch={(val) => filterStore.setSearch(val)}
          initialValue={filters.search}
          className="flex-1"
        />

        <MultiDropdown
          options={CANDIDATES_CONFIG.skills}
          value={selectedSkills}
          onChange={handleSkillsChange}
          getTitle={(value) =>
            value.length ? value.map((v) => v.value).join(', ') : t('pickSkills')
          }
          className="w-full md:w-64"
        />

        <Checkbox
          checkBoxSize="lg"
          label={t('withExp')}
          checked={filters.hasExperience}
          onChange={(checked) => filterStore.setHasExperience(checked)}
        />
      </div>
    </div>
  );
});
