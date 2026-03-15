'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { redirect } from 'next/navigation';

import { NotificationFilters, NotificationList } from '@NotificationHRPageComponents';
import { useNotificationsList } from '@NotificationHooks';
import type {
  NotificationSort,
  NotificationStatus,
  NotificationType,
} from '@NotificationPageTypes';
import { NotificationsStore } from '@NotificationStore';
import { ButtonMarkAll } from '@components';
import { useStore } from '@providers/StoreProvider';
import { siteNavigation } from '@siteNav';
import { Section, Pagination, Loader, ErrorComponent } from '@ui';

type NotificationClientProps = {
  initialPage: number;
  initialType: NotificationType;
  initialStatus: NotificationStatus;
  initialSortBy: NotificationSort;
};

export const NotificationClient = observer(
  ({ initialPage, initialType, initialStatus, initialSortBy }: NotificationClientProps) => {
    const { authStore } = useStore();
    const store = useLocalObservable(
      () =>
        new NotificationsStore({
          page: initialPage,
          type: initialType,
          status: initialStatus,
          sortBy: initialSortBy,
        })
    );

    const { data, isLoading, error } = useNotificationsList(
      store.page,
      store.type,
      store.status,
      store.sortBy
    );

    if (authStore.isLoading) {
      return (
        <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-white">
          <Loader />
        </div>
      );
    }
    if (!authStore.user) {
      redirect(siteNavigation.home);
    }

    if (error) {
      return <ErrorComponent code={500} />;
    }

    const notifications = data?.notifications || [];
    const totalPages = data?.totalPages || 1;

    return (
      <Section>
        <div className="content">
          <NotificationFilters store={store} />
          {authStore.user.unreadNotifications > 0 && <ButtonMarkAll />}

          <NotificationList notifications={notifications} isLoading={isLoading} />
          <Pagination
            currentPage={store.page}
            totalPages={totalPages}
            onPageChange={(page) => store.setPage(page)}
          />
        </div>
      </Section>
    );
  }
);
