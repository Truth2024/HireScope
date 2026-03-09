'use client';
import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useStore } from '@providers/StoreProvider';
import { Button, Loader } from '@ui';

export const ContactCandidate = observer(() => {
  const t = useTranslations('Card');
  const { authStore } = useStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authStore.isLoading) {
    return <Loader size="m" />;
  }

  if (authStore.user?.role === 'candidate') {
    return null;
  }

  return <Button variant="primary">{t('contactCandidate')}</Button>;
});
