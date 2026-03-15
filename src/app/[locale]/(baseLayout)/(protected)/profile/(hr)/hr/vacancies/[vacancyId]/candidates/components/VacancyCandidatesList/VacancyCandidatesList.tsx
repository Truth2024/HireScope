import { useMutation, useQueryClient } from '@tanstack/react-query';

import { VacancyCandidateCard } from '@HRVacancyCandidateComponents';
import type { ICandidate } from '@myTypes/mongoTypes';
import { useStore } from '@providers/StoreProvider';
import { EmptyList, ErrorComponent, Loader } from '@ui';

type ListProps = {
  vacancyId: string;
  isLoading: boolean;
  error: string | null;
  candidates: ICandidate[];
  onAddNote: (candidate: ICandidate) => void;
};

export const VacancyCandidatesList = ({
  vacancyId,
  isLoading,
  error,
  candidates,
  onAddNote,
}: ListProps) => {
  const queryClient = useQueryClient();
  const { authStore } = useStore();
  const acceptCandidateMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      const res = await authStore.fetchWithAuth(`/api/hr/accept/${candidateId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Ошибка подтверждения кандидата');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacancyCandidates', vacancyId],
      });
      queryClient.invalidateQueries({
        queryKey: ['vacancyCandidatesCount', vacancyId],
      });
    },
  });

  const rejectCandidateMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      const res = await authStore.fetchWithAuth(`/api/hr/reject/${candidateId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Ошибка отклонения кандидата');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacancyCandidates', vacancyId],
      });
      queryClient.invalidateQueries({
        queryKey: ['vacancyCandidatesCount', vacancyId],
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <ErrorComponent code={500} />;
  }

  if (candidates.length === 0) {
    return <EmptyList type="candidatesHR" />;
  }

  return (
    <div className="space-y-4">
      {candidates.map((item) => (
        <VacancyCandidateCard
          isAcceptLoading={
            acceptCandidateMutation.isPending && acceptCandidateMutation.variables === item.id
          }
          isRejectLoading={
            rejectCandidateMutation.isPending && rejectCandidateMutation.variables === item.id
          }
          key={item.id}
          candidate={item}
          onAccept={() => acceptCandidateMutation.mutate(item.id)}
          onReject={() => rejectCandidateMutation.mutate(item.id)}
          onAddNote={() => onAddNote(item)}
        />
      ))}
    </div>
  );
};
