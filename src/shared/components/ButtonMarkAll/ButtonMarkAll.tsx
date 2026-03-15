import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useStore } from '@providers/StoreProvider';
import { Button, Loader } from '@ui';

export const ButtonMarkAll = () => {
  const { authStore } = useStore();
  const queryClient = useQueryClient();
  const t = useTranslations('NotificationsPage');
  const [isError, setError] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const markAllAsRead = async () => {
    setError(false);
    setIsLoading(true);
    try {
      const response = await authStore.fetchWithAuth('/api/notifications/read-all', {
        method: 'POST',
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        authStore.resetUnreadCount();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mb-4 flex justify-end">
      <div className="flex flex-col gap-2">
        <Button onClick={markAllAsRead}>
          {isLoading ? <Loader color="white" /> : t('markAllAsRead')}
        </Button>
        {isError && <p className="text-sm text-red-400">{t('markError')}</p>}
      </div>
    </div>
  );
};
