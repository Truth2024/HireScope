'use client';
import { useTranslations } from 'next-intl';

import { Logo, Rating, Skills, VacancySalary } from '@components';
import type { HRVacancyListItem, IVacancy } from '@myTypes/mongoTypes';
import { Button, Card } from '@ui';

type VacancyCardProps = {
  vacancy: IVacancy | HRVacancyListItem;
  href?: string;
  isEditable?: boolean;
};

const VacancyCard = ({ vacancy, href = '', isEditable = false }: VacancyCardProps) => {
  const t = useTranslations('Card');

  const buttonUrl = isEditable
    ? `/profile/hr/vacancies/${vacancy.id}`
    : href || `/vacancies/${vacancy.id}`;

  const buttonText = isEditable ? t('edit') : t('viewposition');

  const normalizedSalary = vacancy.salary
    ? { min: vacancy.salary.min ?? null, max: vacancy.salary.max ?? null }
    : null;
  const hasRating = vacancy.rating > 0;
  return (
    <Card className="gap-4 min-h-80.75 flex flex-col">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight flex-1 min-w-0 line-clamp-2 wrap-break-word">
            {vacancy.title}
          </h3>

          {hasRating && <Rating rating={vacancy.rating} variant="compact" />}
        </div>

        <VacancySalary salary={normalizedSalary} variant="compact" />

        <div className="border-t border-gray-100 my-1" />

        <Skills skills={vacancy.requirements} variant="compact" />
      </div>

      <div className="mt-4 space-y-3">
        {vacancy.company && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-(--color-brand)/10 to-(--color-brand)/5 rounded-lg flex items-center justify-center shrink-0">
              <Logo height={20} width={20} />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs text-gray-400 truncate">{t('company')}</span>
              <span className="font-semibold text-gray-900 truncate">{vacancy.company}</span>
            </div>
          </div>
        )}

        <Button href={buttonUrl} variant="primary" className="w-full truncate">
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default VacancyCard;
