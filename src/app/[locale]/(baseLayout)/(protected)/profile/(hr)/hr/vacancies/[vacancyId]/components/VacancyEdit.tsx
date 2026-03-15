'use client';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import {
  CompanyChanger,
  DescriptionChanger,
  RequirementsChanger,
  SalaryChanger,
  TitleChanger,
} from '@EditVacancyComponents';
import { VacancyEditStore } from '@EditVacancyStore/VacancyEditStore';
import type { IVacancy } from '@myTypes/mongoTypes';
import { useStore } from '@providers/StoreProvider';
import { siteNavigation } from '@siteNav';
import { Button, Card, Loader } from '@ui';

type VacancyEditProps = {
  vacancy: IVacancy;
};

export const VacancyEdit = observer(({ vacancy }: VacancyEditProps) => {
  const { authStore } = useStore();
  const t = useTranslations('Card');
  const router = useRouter();
  const vacancyEditStore = useLocalObservable(() => new VacancyEditStore());

  React.useEffect(() => {
    vacancyEditStore.init(vacancy);
  }, [vacancy, vacancyEditStore]);

  const handleSave = async () => {
    if (!vacancyEditStore.isValid) return;

    const success = await vacancyEditStore.saveChanges(authStore, vacancy.id);
    if (success) {
      router.push(siteNavigation.hr.vacancies);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    const success = await vacancyEditStore.delete(authStore, vacancy.id);
    if (success) {
      router.push(siteNavigation.hr.vacancies);
      router.refresh();
    }
  };

  return (
    <div className="content">
      <div className="flex flex-col gap-4 sm:gap-7.5 mb-6 sm:mb-10">
        <Card>
          <TitleChanger
            initialTitle={vacancyEditStore.title}
            setTitle={vacancyEditStore.setTitle}
            error={vacancyEditStore.errors.title}
          />
        </Card>

        <Card>
          <CompanyChanger
            initialCompany={vacancyEditStore.company}
            setCompany={vacancyEditStore.setCompany}
            error={vacancyEditStore.errors.company}
          />
        </Card>

        <Card>
          <SalaryChanger
            initialSalary={vacancyEditStore.salary}
            setSalary={vacancyEditStore.setSalaryField}
            error={vacancyEditStore.errors.salary}
          />
        </Card>

        <Card>
          <DescriptionChanger
            initialDescription={vacancyEditStore.description}
            setDescription={vacancyEditStore.setDescription}
            error={vacancyEditStore.errors.description}
          />
        </Card>

        <Card>
          <RequirementsChanger
            store={vacancyEditStore}
            error={vacancyEditStore.errors.requirements}
          />
        </Card>
      </div>

      <Card>
        {vacancyEditStore.errorServer && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              {vacancyEditStore.errorServer}
            </p>
          </div>
        )}

        <div className="flex md:justify-end md:gap-7 gap-4 flex-wrap justify-center">
          <Button
            variant={'cancel'}
            onClick={() => router.push(siteNavigation.hr.vacancies)}
            disabled={vacancyEditStore.isLoading}
          >
            {t('back')}
          </Button>

          <Button onClick={handleDelete} variant={'danger'} disabled={vacancyEditStore.isLoading}>
            {vacancyEditStore.isLoading ? <Loader color="white" size="s" /> : t('delete')}
          </Button>

          <Button
            disabled={
              vacancyEditStore.isLoading ||
              !vacancyEditStore.isValid ||
              !vacancyEditStore.hasChanges
            }
            onClick={handleSave}
          >
            {vacancyEditStore.isLoading ? <Loader color="white" size="s" /> : t('save')}
          </Button>
        </div>
      </Card>
    </div>
  );
});
