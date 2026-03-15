import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { NotificationClient } from '@NotificationCandidatePageComponents';
import type {
  NotificationSort,
  NotificationStatus,
  NotificationType,
} from '@NotificationPageTypes';
import { NotificationsPageService } from '@NotificationService';
import {
  DEFAULT_NOTIFICATION_CANDIDATE_SORT,
  DEFAULT_NOTIFICATION_CANDIDATE_STATUS,
  DEFAULT_NOTIFICATION_CANDIDATE_TYPE,
} from '@constants/constants';
import { ErrorComponent } from '@ui';

type NotificationsPageProps = {
  searchParams: Promise<{
    page: string;
    type?: NotificationType;
    status?: NotificationStatus;
    sortBy?: NotificationSort;
  }>;
};

export default async function NotificationsCandidatePage({ searchParams }: NotificationsPageProps) {
  const sParams = await searchParams;

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    redirect(`/login`);
  }

  const page = Number(sParams.page) || 1;
  const type = sParams.type || DEFAULT_NOTIFICATION_CANDIDATE_TYPE;
  const status = sParams.status || DEFAULT_NOTIFICATION_CANDIDATE_STATUS;
  const sortBy = sParams.sortBy || DEFAULT_NOTIFICATION_CANDIDATE_SORT;

  const result = await NotificationsPageService(refreshToken, page, {
    type,
    status,
    sortBy,
  });

  if (result.status === 'unauthorized') {
    redirect('/login');
  }

  if (result.status === 'error') {
    return <ErrorComponent code={result.code} />;
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notifications', { page, type, status, sortBy }],
    queryFn: () => Promise.resolve(result.data),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotificationClient
        initialPage={page}
        initialType={type}
        initialStatus={status}
        initialSortBy={sortBy}
      />
    </HydrationBoundary>
  );
}
