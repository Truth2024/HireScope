'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';

import {
  Filters,
  VacancyCandidatesList,
  Statistics,
  NoteModal,
} from '@HRVacancyCandidateComponents';
import { CandidatesStore } from '@HRVacancyCandidateStore/candidatesStore';
import type { ICandidate } from '@myTypes/mongoTypes';
import { useStore } from '@providers/StoreProvider';
import { Pagination } from '@ui';

type Props = {
  vacancyId: string;
  initialPage: number;
  initialSearch: string;
  initialExperience: boolean;
  initialSortBy: 'matchScore' | 'appliedAt';
  initialOrder: 'desc' | 'asc';
};

export const VacancyCandidate = observer((props: Props) => {
  const store = useLocalObservable(() => new CandidatesStore());
  const [isNoteModalOpen, setIsNoteModalOpen] = React.useState(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState<ICandidate | null>(null);
  const { authStore } = useStore();

  const queryClient = useQueryClient();

  const updateNoteMutation = useMutation({
    mutationFn: async ({ candidateId, note }: { candidateId: string; note: string }) => {
      const res = await authStore.fetchWithAuth(`/api/hr/create-note/${candidateId}`, {
        method: 'PATCH',
        body: JSON.stringify({ note }),
      });

      if (!res.ok) throw new Error('Ошибка сохранения заметки');

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacancyCandidates', props.vacancyId],
      });
    },
  });
  React.useEffect(() => {
    store.page = props.initialPage;
    store.search = props.initialSearch;
    store.hasExperience = props.initialExperience;
    store.sortBy = props.initialSortBy;
    store.order = props.initialOrder;
  }, [props, store]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'vacancyCandidates',
      props.vacancyId,
      {
        page: store.page,
        search: store.search,
        hasExperience: store.hasExperience,
        sortBy: store.sortBy,
        order: store.order,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(store.page),
        search: store.search,
        hasExperience: String(store.hasExperience),
        sortBy: store.sortBy,
        order: store.order,
      });
      const res = await fetch(`/api/hr/vacancy/${props.vacancyId}/candidates?${params}`);
      if (!res.ok) throw new Error('Ошибка загрузки');
      return res.json();
    },
  });

  return (
    <div className="content space-y-6">
      <Filters
        search={store.search}
        hasExperience={store.hasExperience}
        sortBy={store.sortBy}
        order={store.order}
        onSearch={(v) => store.setSearch(v)}
        onExperienceToggle={() => store.toggleExperience()}
        onSortChange={(sb, o) => store.setSort(sb, o)}
      />

      <Statistics
        isLoading={isLoading}
        total={data?.total ?? 0}
        totalPages={data?.totalPages ?? 1}
        currentPage={store.page}
      />

      <VacancyCandidatesList
        vacancyId={props.vacancyId}
        isLoading={isLoading}
        error={error?.message || null}
        candidates={data?.candidates ?? []}
        onAddNote={(item) => {
          setSelectedCandidate(item);
          setIsNoteModalOpen(true);
        }}
      />

      {data?.totalPages > 1 && (
        <Pagination
          currentPage={store.page}
          totalPages={data.totalPages}
          onPageChange={(p) => store.setPage(p)}
        />
      )}
      <NoteModal
        isOpen={isNoteModalOpen}
        candidate={selectedCandidate}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedCandidate(null);
        }}
        onSave={(candidateId, notes) => updateNoteMutation.mutate({ candidateId, note: notes })}
      />
    </div>
  );
});
