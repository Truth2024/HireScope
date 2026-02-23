'use client';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar } from '@components';
import { useStore } from '@providers/StoreProvider';

import { getLinkClasses } from '../ActiveNav/ActiveNav';

export const Profile = observer(() => {
  const pathname = usePathname();
  const { authStore } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || authStore.isLoading) {
    return <span className="text-white">loading...</span>;
  }

  if (!authStore.user) {
    return (
      <Link href="/login" className={getLinkClasses('/login', pathname)}>
        Sign in
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
