'use client';

import { useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import React, { createContext, useCallback, useContext, useState } from 'react';

import { useNotificationSound } from '@hooks/useNotificationSound';
import { useSound } from '@hooks/useSound';
import { invalidateCandidateQueries } from '@lib/invalidateCandidateQueries';
import { pusherClient } from '@lib/pusherClient';
import { showNotificationToast } from '@lib/showNotificationToast';
import { playNotificationSound } from '@lib/utils';
import type { NotificationContextType, Notification } from '@myTypes/notification';

import { useStore } from './StoreProvider';

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = observer(({ children }: { children: React.ReactNode }) => {
  const { authStore } = useStore();
  const queryClient = useQueryClient();
  const { playSound } = useSound();

  const { isSoundEnabled, toggleSound } = useNotificationSound();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  React.useEffect(() => {
    const userId = authStore.user?.id;

    if (!userId) {
      setNotifications([]);
      return;
    }

    const channel = pusherClient.subscribe(`user-${userId}`);

    const handler = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);

      if (isSoundEnabled) {
        playNotificationSound(data.type, playSound);
      }

      showNotificationToast(data);

      if (data.type === 'new_candidate') {
        invalidateCandidateQueries(queryClient, data.vacancyId);
      }
    };

    channel.bind('notification', handler);

    return () => {
      channel.unbind('notification', handler);
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [authStore.user?.id, queryClient, isSoundEnabled, playSound]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        clearNotifications,
        toggleSound,
        isSoundEnabled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
});

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return context;
};
