import { useQuery } from '@tanstack/react-query';

import type {
  NotificationSort,
  NotificationStatus,
  NotificationType,
} from '@NotificationPageTypes';
import { useStore } from '@providers/StoreProvider';

export const useNotificationsList = (
  page: number,
  type?: NotificationType,
  status?: NotificationStatus,
  sortBy?: NotificationSort
) => {
  const { authStore } = useStore();

  return useQuery({
    queryKey: ['notifications', { page, type, status, sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
      });

      if (type && type !== 'all') params.set('type', type);
      if (status && status !== 'all') params.set('status', status);
      if (sortBy && sortBy !== 'newest') params.set('sortBy', sortBy);

      const response = await authStore.fetchWithAuth(`/api/notifications?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch notifications');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!authStore.user?.id,
  });
};
