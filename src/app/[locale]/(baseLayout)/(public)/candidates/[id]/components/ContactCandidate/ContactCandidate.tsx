'use client';
import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useStore } from '@providers/StoreProvider';
import { Button, Loader } from '@ui';

type ContactCandidateProps = {
  isOwner: boolean;
};

export const ContactCandidate = observer(({ isOwner = false }: ContactCandidateProps) => {
  const t = useTranslations('Card');
  const { authStore } = useStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authStore.isLoading) {
    return <Loader size="m" />;
  }
  if (isOwner) {
    return (
      <Button href="/profile" variant="primary">
        {t('edit')}
      </Button>
    );
  }

  if (authStore.user?.role === 'candidate') {
    return null;
  }

  return <Button variant="primary">{t('contactCandidate')}</Button>;
});
