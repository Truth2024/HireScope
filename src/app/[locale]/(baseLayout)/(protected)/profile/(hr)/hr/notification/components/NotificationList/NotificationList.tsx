import { NotificationCard } from '@NotificationHRPageComponents';
import type { NotificationPage } from '@NotificationPageTypes';
import { EmptyList, Loader } from '@ui';

type NotificationListProps = {
  notifications: NotificationPage[];
  isLoading: boolean;
};

export const NotificationList = ({ notifications, isLoading }: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (notifications.length === 0) {
    return <EmptyList type={'notifications'} />;
  }

  return (
    <ul className="space-y-2 mb-4">
      {notifications.map((notification: NotificationPage) => (
        <li key={notification.id}>
          <NotificationCard notification={notification} />
        </li>
      ))}
    </ul>
  );
};
