import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { siteNavigation } from '@siteNav';
import { Button } from '@ui';

export const VacancyNotFound = async () => {
  const t = await getTranslations('notFoundVacancy');

  return (
    <div className="content flex flex-1">
      <div className="flex flex-col items-center justify-center py-20 flex-1">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('title')}</h2>

        <p className="text-gray-500 mb-6">{t('description')}</p>

        <Link href={siteNavigation.vacancies}>
          <Button variant="primary">{t('button')}</Button>
        </Link>
      </div>
    </div>
  );
};
