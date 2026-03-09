'use client';
import { useTranslations } from 'next-intl';

import { Logo, Rating, Skills } from '@components';
import type { IVacancy } from '@myTypes/mongoTypes';
import { Button, Card } from '@ui';

import { VacancySalary } from '../VacancySalary/VacancySalary';

type VacancyCardProps = {
  vacancy: IVacancy;
};

const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  const t = useTranslations('Card');
  return (
    <Card className="gap-4 min-h-80.75">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-xl font-semibold text-gray-900 leading-tight flex-1">
              {vacancy.title}
            </h3>

            <Rating rating={vacancy.rating} variant="compact" />
          </div>

          <VacancySalary salary={vacancy.salary} variant="compact" />

          <div className="border-t border-gray-100 my-1" />

          <Skills skills={vacancy.requirements} variant="compact" />
        </div>

        <div className="mt-4 space-y-3">
          {vacancy.company && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-(--color-brand)/10 to-(--color-brand)/5 rounded-lg flex items-center justify-center shrink-0">
                <Logo height={20} width={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">{t('company')}</span>
                <span className="font-semibold text-gray-900">{vacancy.company}</span>
              </div>
            </div>
          )}

          <Button href={`/vacancies/${vacancy.id}`} variant="primary" className="w-full">
            {t('viewposition')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VacancyCard;
