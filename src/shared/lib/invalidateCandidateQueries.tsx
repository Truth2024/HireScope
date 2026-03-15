import type { QueryClient } from '@tanstack/react-query';

export const invalidateCandidateQueries = (queryClient: QueryClient, vacancyId?: string) => {
  if (!vacancyId) return;

  queryClient.invalidateQueries({
    queryKey: ['vacancyCandidates', vacancyId],
  });

  queryClient.invalidateQueries({
    queryKey: ['vacancyCandidatesCount', vacancyId],
  });
};
