import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { VacancyBadgeClient, VacancyEmptyCard } from '@EditVacancyComponents';
import { getHRVacancies } from '@HRVacanciesServices/HRVacanciesServices';
import { VacancyCard } from '@components';
import { Card, ErrorComponent, Section } from '@ui';

export default async function HRMainPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const result = await getHRVacancies(refreshToken);
  const t = await getTranslations('Card');

  if (result.status === 'unauthorized' || result.status === 'forbidden') {
    redirect('/');
  }

  if (result.status === 'error') {
    return <ErrorComponent code={result.code} />;
  }

  const plainVacancies = result.data;

  return (
    <Section>
      <div className="content">
        <Card>
          <h1 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            {t('myVacancies')}
          </h1>

          {plainVacancies.length === 0 ? (
            <p className="text-gray-500 text-center">{t('HRvacanciesNotFound')}</p>
          ) : (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 mb-10">
              {plainVacancies.map((item) => (
                <li key={item.id} className="relative">
                  <VacancyCard vacancy={item} isEditable={true} />
                  <VacancyBadgeClient
                    vacancyId={item.id}
                    initialCount={item.candidates.length || 0}
                    className="absolute -top-2 -right-2 z-10"
                  />
                </li>
              ))}
            </ul>
          )}

          <VacancyEmptyCard />
        </Card>
      </div>
    </Section>
  );
}
