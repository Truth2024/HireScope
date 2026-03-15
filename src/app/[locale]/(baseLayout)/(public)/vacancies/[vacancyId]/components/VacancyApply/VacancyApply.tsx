'use client';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { useStore } from '@providers/StoreProvider';
import { Button, Loader } from '@ui';

type VacancyApplyProps = {
  vacancyId: string;
  isOwner?: boolean;
  hasApplied?: boolean;
};

export const VacancyApply = observer(
  ({ vacancyId, isOwner = false, hasApplied }: VacancyApplyProps) => {
    const { authStore } = useStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);

    const t = useTranslations('Card');

    const handleApply = async () => {
      if (!authStore.user) return;
      setLoadingSub(true);
      try {
        const res = await authStore.fetchWithAuth(`/api/sub-vacancy/${vacancyId}`, {
          method: 'PATCH',
          body: JSON.stringify({ candidateId: authStore.user.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Ошибка отклика');

        // после успешного отклика, меняем состояние кнопки
        setApplied(true);
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoadingSub(false);
      }
    };

    const [applied, setApplied] = useState(hasApplied);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted || authStore.isLoading) return <Loader size="m" />;

    if (!authStore.user) {
      return (
        <Button
          variant="primary"
          className="max-[480px]:w-full"
          onClick={() => router.push('/auth/login')}
        >
          {t('entryaccount')}
        </Button>
      );
    }

    if (isOwner) {
      return (
        <Button
          variant="primary"
          className="max-[480px]:w-full"
          onClick={() => router.push(`/profile/hr/vacancies/${vacancyId}`)}
        >
          {t('editVacancy')}
        </Button>
      );
    }

    if (applied) {
      return (
        <Button variant="secondary" className="text-(--color-brand)" disabled>
          {t('alreadyApplied')}
        </Button>
      );
    }

    return (
      <Button onClick={handleApply} variant="primary" className="max-[480px]:w-full">
        {loadingSub ? <Loader size="s" /> : t('apply')}
      </Button>
    );
  }
);
