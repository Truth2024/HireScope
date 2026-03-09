'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { cn } from '@lib/utils';

type VacancyEmptyCardProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  title?: string;
  description?: string;
};

export const VacancyEmptyCard = ({
  href = '/profile/hr/vacancies/create',
  onClick,
  className,
  description,
}: VacancyEmptyCardProps) => {
  const t = useTranslations('Card');

  const content = (
    <div
      className={cn(
        'group relative flex flex-col items-center justify-center gap-4',
        'min-h-80 h-full w-full',
        'border-2 border-dashed border-gray-300 rounded-2xl',
        'bg-gray-50/50 hover:bg-gray-100',
        'transition-all duration-200 cursor-pointer',
        'hover:border-(--color-brand) hover:shadow-md',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center',
          'w-16 h-16 rounded-full',
          'bg-white border-2 border-dashed border-gray-300',
          'group-hover:border-(--color-brand) group-hover:bg-(--color-brand)/5',
          'transition-all duration-200'
        )}
      >
        <Plus
          className={cn(
            'w-8 h-8 text-gray-400',
            'group-hover:text-(--color-brand)',
            'transition-colors duration-200'
          )}
        />
      </div>

      <div className="text-center px-4">
        <h3 className="text-lg font-semibold text-gray-700 group-hover:text-(--color-brand) transition-colors">
          {t('createVacancy')}
        </h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>

      <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity pb-4">
        <span className="text-xs text-(--color-brand) bg-white px-3 py-1 rounded-full shadow-sm">
          {t('Clue')}
        </span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full h-full">
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className="block w-full h-full">
      {content}
    </Link>
  );
};
