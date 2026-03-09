'use client';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Avatar } from '@components';
import { useStore } from '@providers/StoreProvider';
import { Loader } from '@ui';

import { getLinkClasses } from '../ActiveNav/ActiveNav';

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
      <Link href="/login" className={getLinkClasses('/login', pathname)}>
        {t('nav.signIn')}
      </Link>
    );
  }

  return (
    <Link href={'/profile'}>
      <Avatar
        firstName={authStore.user.firstName}
        secondName={authStore.user.secondName}
        avatar={authStore.user.avatar ?? null}
        size="small"
      />
    </Link>
  );
});
