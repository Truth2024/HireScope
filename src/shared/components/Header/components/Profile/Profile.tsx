'use client';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Avatar, NotificationsCounter } from '@components';
import { getLinkClasses } from '@lib/utils';
import { useStore } from '@providers/StoreProvider';
import { siteNavigation } from '@siteNav';
import { Loader } from '@ui';

export const Profile = observer(() => {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const { authStore } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || authStore.isLoading) {
    return (
      <div className="h-14 w-14 flex justify-center items-center">
        <Loader size="m" />
      </div>
    );
  }

  if (!authStore.user) {
    return (
      <Link href={siteNavigation.login} className={getLinkClasses(siteNavigation.login, pathname)}>
        {t('nav.signIn')}
      </Link>
    );
  }
  return (
    <Link href={siteNavigation.profile} className="relative">
      <NotificationsCounter type="header" />
      <Avatar
        firstName={authStore.user.firstName}
        secondName={authStore.user.secondName}
        avatar={authStore.user.avatar ?? null}
        size="small"
      />
    </Link>
  );
});
