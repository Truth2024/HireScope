'use client';
import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { useStore } from '@providers/StoreProvider';
import { Button, Loader } from '@ui';

export const VacancyApply = observer(({}: { vacancyId?: string }) => {
  const { authStore } = useStore();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Card');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authStore.isLoading) {
    return <Loader size="m" />;
  }

  if (authStore.user?.role === 'hr') {
    return null;
  }

  return (
    <Button variant="primary" className="max-[480px]:w-full">
      {t('apply')}
    </Button>
  );
});
