'use client';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { useStore } from '@providers/StoreProvider';
import { siteNavigation } from '@siteNav';
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
    const [mounted, setMounted] = useState<boolean>(false);
    const [loadingSub, setLoadingSub] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const t = useTranslations('Card');

    const handleApply = async () => {
      if (!authStore.user) return;
      setLoadingSub(true);
      try {
        setIsError(false);
        const res = await authStore.fetchWithAuth(`/api/sub-vacancy/${vacancyId}`, {
          method: 'PATCH',
          body: JSON.stringify({ candidateId: authStore.user.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Ошибка отклика');

        setApplied(true);
      } catch {
        setIsError(true);
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
          onClick={() => router.push(siteNavigation.login)}
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
          onClick={() => router.push(siteNavigation.hr.vacancyDetail(vacancyId))}
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
      <div className="flex flex-col gap-2 max-[480px]:w-full">
        <Button onClick={handleApply} variant="primary">
          {loadingSub ? <Loader color="white" size="s" /> : t('apply')}
        </Button>
        {isError && <p className="text-sm text-red-400">{t('applyError')}</p>}
      </div>
    );
  }
);
