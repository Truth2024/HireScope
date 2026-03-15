import type { NotificationSort, NotificationStatus } from '@NotificationPageTypes';
import type { NotificationsStore } from '@NotificationStore';
import { SingleDropdown } from '@ui';

type NotificationFiltersProps = {
  store: NotificationsStore;
};

export const NotificationFilters = ({ store }: NotificationFiltersProps) => {
  const sortOptions = [
    { key: 'newest', value: 'Сначала новые' },
    { key: 'oldest', value: 'Сначала старые' },
  ];

  const sortOptionsStatus = [
    { key: 'all', value: 'Все' },
    { key: 'read', value: 'Прочитаные' },
    { key: 'unread', value: 'Непрочитаные' },
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
