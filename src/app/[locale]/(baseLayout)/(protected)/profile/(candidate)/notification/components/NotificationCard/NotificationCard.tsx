'use client';

import { useTranslations } from 'next-intl';

import type { NotificationPage } from '@NotificationPageTypes';
import { Logo } from '@components';
import { formattedDate } from '@lib/utils';
import { Card } from '@ui';

const getMessageColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'candidate-accepted': 'bg-green-100 text-green-800',
    'candidate-rejected': 'bg-red-100 text-red-800',
    // prettier-ignore
    'new_candidate': 'bg-blue-100 text-blue-800', // ругается на название через _
  };

  return colorMap[type] || 'bg-gray-100 text-gray-800';
};

type NotificationCardProps = {
  notification: NotificationPage;
};

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const t = useTranslations('NotificationsPage');

  const messageColorClass = getMessageColor(notification.type);

  return (
    <Card>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="font-semibold text-2xl">{notification.data.title}</div>
          {!notification.read && (
            <span className="inline-block text-xs font-medium bg-(--color-brand)/10 text-(--color-brand) px-3 py-1 rounded-full">
              {t('new')}
            </span>
          )}
        </div>

        {notification.data.company && (
          <span className="bg-(--color-brand)/10 text-(--color-brand) px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 w-fit">
            <Logo height={20} width={20} />
            {notification.data.company}
          </span>
        )}

        {notification.data.message && (
          <div className={`text-sm mt-2 p-2 rounded w-fit ${messageColorClass}`}>
            {notification.data.message}
          </div>
        )}

        <div className="text-xs text-gray-400 mt-2">{formattedDate(notification.createdAt)}</div>
      </div>
    </Card>
  );
};
