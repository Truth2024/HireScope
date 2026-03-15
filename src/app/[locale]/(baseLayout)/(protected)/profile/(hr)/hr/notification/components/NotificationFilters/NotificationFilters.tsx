import { useTranslations } from 'next-intl';

import type { NotificationSort, NotificationStatus } from '@NotificationPageTypes';
import type { NotificationsStore } from '@NotificationStore';
import { SingleDropdown } from '@ui';

type NotificationFiltersProps = {
  store: NotificationsStore;
};

export const NotificationFilters = ({ store }: NotificationFiltersProps) => {
  const t = useTranslations('NotificationsPage.filters');

  const sortOptions = [
    { key: 'newest', value: t('sort.newest') },
    { key: 'oldest', value: t('sort.oldest') },
  ];

  const sortOptionsStatus = [
    { key: 'all', value: t('status.all') },
    { key: 'read', value: t('status.read') },
    { key: 'unread', value: t('status.unread') },
  ];

  const currentSort = sortOptions.find((opt) => opt.key === store.sortBy) || sortOptions[0];
  const currentSortStatus =
    sortOptionsStatus.find((opt) => opt.key === store.status) || sortOptionsStatus[0];

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <SingleDropdown
        options={sortOptions}
        value={currentSort}
        onChange={(option) => store.setSortBy(option.key as NotificationSort)}
        getTitle={(option) => option?.value || 'Сортировка'}
        className="md:w-64 max-w-full"
      />

      <SingleDropdown
        options={sortOptionsStatus}
        value={currentSortStatus}
        onChange={(option) => store.setStatus(option.key as NotificationStatus)}
        getTitle={(option) => option?.value || 'Сортировка'}
        className="md:w-64 max-w-full"
      />
    </div>
  );
};
