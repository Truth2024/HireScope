'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';

import { CandidatesStore } from '@candidatesStore';
import { skills } from '@constants/constants';
import type { IUser } from '@myTypes/mongoTypes';
import type { Option } from '@ui';
import { MultiDropdown, Search } from '@ui';

import { CandidatesList } from '../CandidatesList/CandidatesList';

type CandidateClientProps = {
  initialCandidates: IUser[];
  totalPages: number;
  currentPage: number;
  search: string;
  selectedSkills?: Option[];
};

export const CandidateClient = observer(
  ({
    initialCandidates,
    totalPages,
    currentPage,
    search,
    selectedSkills = [],
  }: CandidateClientProps) => {
    const store = useLocalObservable(
      () =>
        new CandidatesStore({
          candidates: initialCandidates,
          totalPages,
          currentPage,
          search,
          selectedSkills,
        })
    );

    const t = useTranslations('Card');
    const searchParams = useSearchParams();

    useEffect(() => {
      const urlSearch = searchParams.get('search') || '';
      const urlPage = Number(searchParams.get('page')) || 1;

      const urlSkills =
        searchParams
          .get('skills')
          ?.split(',')
          .filter(Boolean)
          .map((skill) => ({ key: skill, value: skill })) || [];

      if (
        urlSearch !== store.search ||
        JSON.stringify(urlSkills) !== JSON.stringify(store.selectedSkills)
      ) {
        store.fetchCandidates(urlPage, urlSearch, urlSkills);
      }
    }, []); // eslint-disable-line

    const handleSearch = useCallback(
      (value: string) => {
        store.setSearch(value);
      },
      [store]
    );

    const handleSkillsChange = useCallback(
      (options: Option[]) => {
        store.setSkills(options);
      },
      [store]
    );

    const handlePageChange = useCallback(
      (page: number) => {
        store.setPage(page);
      },
      [store]
    );

    return (
      <div>
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <Search
            placeholder={`${t('search')}...`}
            buttonText={t('search')}
            handleSearch={handleSearch}
            initialValue={store.search}
            className="flex-1"
          />

          <MultiDropdown
            options={skills}
            value={store.selectedSkills}
            onChange={handleSkillsChange}
            getTitle={(value) =>
              value.length ? value.map((v) => v.value).join(', ') : t('pickSkills')
            }
            className="w-full md:w-64"
          />
        </div>

        <CandidatesList
          candidates={store.candidates}
          totalPages={store.totalPages}
          currentPage={store.currentPage}
          search={store.search}
          loading={store.loading}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }
);
