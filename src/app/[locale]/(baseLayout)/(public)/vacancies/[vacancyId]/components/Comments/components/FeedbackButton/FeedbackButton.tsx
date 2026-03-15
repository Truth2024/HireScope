'use client';

import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';

import { ModalComment } from '@commentsComponents';
import type { CommentsStore } from '@commentsStore';
import { useStore } from '@providers/StoreProvider';
import { siteNavigation } from '@siteNav';
import { Button, Loader } from '@ui';

type FeedbackButtonProps = {
  store: CommentsStore;
};

export const FeedbackButton = observer(({ store }: FeedbackButtonProps) => {
  const t = useTranslations('Card');
  const { authStore } = useStore();
  const [isOpenModal, setOpenModal] = React.useState<boolean>(false);
  const [isClient, setIsClient] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-11 w-full" />;
  }

  if (authStore.isLoading) {
    return (
      <div className="h-12 flex justify-center items-center">
        <Loader size="m" />
      </div>
    );
  }

  if (authStore.user?.role === 'hr') {
    return null;
  }

  const openModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  if (authStore.user && authStore.accessToken) {
    return (
      <>
        <Button onClick={openModal}>{t('feedback')}</Button>
        {isOpenModal && <ModalComment isOpen={isOpenModal} setClose={closeModal} store={store} />}
      </>
    );
  }

  return (
    <Link
      href={siteNavigation.login}
      className="gap-3 w-full lg:max-w-90 py-5 px-2 h-80 bg-(--color-brand) hover:bg-(--color-brand-hover) transition-colors duration-300 flex flex-col rounded-xl justify-center items-center"
    >
      <Image
        height={250}
        width={250}
        alt="ur"
        priority
        src="/images/entryAccount1.png"
        className="w-auto h-auto"
      />
      <p className="text-white font-semibold text-base text-center">
        {t('unauthorized')}
        <br /> {t('unauthorizedDescr')}
      </p>
    </Link>
  );
});
