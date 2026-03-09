'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { skills } from '@constants/constants';
import type { Option } from '@ui';

type VacancyFilters = {
  search: string;
  page: number;
  skills: string[];
  skillOptions: Option[];
  sort: string;
};

export const useVacancyFilters = (): VacancyFilters => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page')) || 1;
    const skillsParam = searchParams.get('skills')?.split(',').filter(Boolean) || [];
    const sort = searchParams.get('sort') || 'newest';

    const skillOptions: Option[] = skillsParam.map((skillValue) => {
      const skill = skills.find((s) => s.value === skillValue);
      return {
        key: skill?.key || skillValue.toLowerCase().replace(/\s+/g, ''),
        value: skillValue,
      };
    });

    return {
      search,
      page,
      skills: skillsParam,
      skillOptions,
      sort,
    };
  }, [searchParams]);
};
