'use client';
import { observer } from 'mobx-react-lite';

import { cn } from '@lib/utils';
import { useStore } from '@providers/StoreProvider';
import { Loader } from '@ui';

type NotificationsCounterProps = {
  type?: 'header' | 'profile';
};

export const NotificationsCounter = observer(({ type = 'header' }: NotificationsCounterProps) => {
  const { authStore } = useStore();

  const baseClasses = cn(
    'flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white rounded-full shadow-lg absolute',
    'bg-(--color-brand)'
  );

  const positionClasses = cn({
    '-top-1 -right-1 z-(--z-header-counter)': type === 'header',
    'top-3 -right-6': type === 'profile',
  });

  if (authStore.isLoading) {
    return (
      <div className={cn(baseClasses, positionClasses)}>
        <Loader size="xs" color="white" />
      </div>
    );
  }

  if (!authStore.user) return null;

  if (authStore.user.unreadNotifications === 0) return null;

  return (
    <div className={cn(baseClasses, positionClasses)}>
      {authStore.user.unreadNotifications > 99 ? '99+' : authStore.user.unreadNotifications}
    </div>
  );
});
