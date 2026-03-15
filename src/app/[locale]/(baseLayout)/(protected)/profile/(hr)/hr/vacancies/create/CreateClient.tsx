'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import {
  CompanyChanger,
  DescriptionChanger,
  RequirementsChanger,
  SalaryChanger,
  TitleChanger,
} from '@EditVacancyComponents';
import { VacancyEditStore } from '@EditVacancyStore/VacancyEditStore';
import { useStore } from '@providers/StoreProvider';
import { siteNavigation } from '@siteNav';
import { Button, Card, Loader } from '@ui';

export const CreateClient = observer(() => {
  const vacancyEditStore = useLocalObservable(() => new VacancyEditStore());
  const { authStore } = useStore();
  const t = useTranslations('Card');
  const router = useRouter();

  useEffect(() => {
    vacancyEditStore.validateAll();
  }, [vacancyEditStore]);

  const handleSave = async () => {
    if (!vacancyEditStore.isValid) return;

    const result = await vacancyEditStore.create(authStore);

    if (typeof result === 'object' && result.success) {
      router.push(siteNavigation.hr.vacancies);
      router.refresh();
    }
  };

  return (
    <div className="content">
      <div className="flex flex-col gap-7.5 mb-10">
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
          <p className="text-sm text-red-400 ">{vacancyEditStore.errorServer}</p>
        )}

        <div className="flex justify-end gap-7">
          <Button
            variant={'cancel'}
            onClick={() => router.push(siteNavigation.hr.vacancies)}
            disabled={vacancyEditStore.isLoading}
          >
            {t('back')}
          </Button>

          <Button
            disabled={vacancyEditStore.isLoading || !vacancyEditStore.isValid}
            onClick={handleSave}
          >
            {vacancyEditStore.isLoading ? <Loader color="white" size="s" /> : t('save')}
          </Button>
        </div>
      </Card>
    </div>
  );
});
