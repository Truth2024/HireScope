import { useQuery } from '@tanstack/react-query';

async function fetchCandidatesCount(vacancyId: string): Promise<number> {
  const response = await fetch(`/api/hr/vacancy/${vacancyId}/candidates/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch candidates count');
  }
  const data = await response.json();
  return data.count;
}

export const useVacancyCandidatesCount = (vacancyId: string) => {
  return useQuery({
    queryKey: ['vacancyCandidatesCount', vacancyId],
    queryFn: () => fetchCandidatesCount(vacancyId),
    enabled: !!vacancyId,
    staleTime: 5 * 60 * 1000,
  });
};
