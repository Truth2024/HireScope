'use client';

import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';

import type { NotificationPage } from '@NotificationPageTypes';
import { Avatar } from '@components';
import { formattedDate } from '@lib/utils';
import { siteNavigation } from '@siteNav';
import { Button, Card } from '@ui';

type NotificationCardProps = {
  notification: NotificationPage;
};

export const NotificationCard = observer(({ notification }: NotificationCardProps) => {
  const t = useTranslations('NotificationsPage');
  const { data, read, createdAt } = notification;

  return (
    <Card className="py-4 sm:py-6">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-4">
        <div className="flex gap-2 sm:gap-4 flex-1 min-w-0 w-full lg:w-auto">
          <Avatar
            firstName={data.firstName || ''}
            secondName={data.secondName || ''}
            avatar={data.avatar || ''}
            size="medium"
          />

          <div className="min-w-0 flex-1">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight wrap-break-word">
              {data.firstName} {data.secondName}
            </h3>

            {!read && (
              <span className="inline-block mt-2 text-xs font-medium bg-(--color-brand)/10 text-(--color-brand) px-3 py-1 rounded-full">
                {t('new')}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600 bg-transparent sm:bg-gray-50 p-3 rounded-lg w-fit">
        {t('applied', {
          title: data.title || 'вакансия',
          company: data.company || 'компания',
        })}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400 mt-2">{formattedDate(createdAt)}</div>
        <Button href={siteNavigation.hr.vacancyCandidates(data.vacancyId)}>{t('details')}</Button>
      </div>
    </Card>
  );
});
