'use client';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useStore } from '@providers/StoreProvider';
import { Loader } from '@ui';

const ROLE_REDIRECTS = {
  candidate: '/profile/main',
  hr: '/profile/hr/vacancies',
} as const;

export const ProfileClient = observer(() => {
  const { authStore } = useStore();
  const router = useRouter();

  const { user, isLoading } = authStore;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    const targetPath = ROLE_REDIRECTS[user.role as keyof typeof ROLE_REDIRECTS];
    router.replace(targetPath);
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return null;
});
