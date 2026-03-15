'use client';

import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DateInfo } from '@components';
import { ExperienceChanger, SkillsChanger } from '@profileMainCandidate';
import { useStore } from '@providers/StoreProvider';
import { Card, Loader } from '@ui';

import { AvatarWithUpload } from '../AvatarWithUpload/AvatarWithUpload';

export const ProfileMainClient = observer(() => {
  const { authStore } = useStore();
  const t = useTranslations('Card');

  if (authStore.isLoading || !authStore.user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-(--z-modal)">
        <Loader />
      </div>
    );
  }

  return (
    <Card>
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center mb-3 sm:mb-8">
        <AvatarWithUpload
          firstName={authStore.user.firstName}
          secondName={authStore.user.secondName}
          avatar={authStore.user.avatar ?? null}
          size="large"
          store={authStore}
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {authStore.user.firstName} {authStore.user.secondName}
            </h1>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <Link
                href={`mailto:${authStore.user.email}`}
                className="hover:text-(--color-brand) transition-colors"
              >
                {authStore.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 my-4 sm:my-6" />
      <section className="mb-3 sm:mb-8">
        <SkillsChanger authStore={authStore} />
      </section>

      <section className="mb-3 sm:mb-8">
        <ExperienceChanger store={authStore} />
      </section>

      <div className="border-t border-gray-100 my-4 sm:my-6" />
      <div className="flex justify-between items-center">
        <DateInfo date={authStore.user.createdAt} title={t('memberSince')} />
      </div>
    </Card>
  );
});
