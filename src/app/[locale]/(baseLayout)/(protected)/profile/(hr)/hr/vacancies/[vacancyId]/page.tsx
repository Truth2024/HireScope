import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { vacancyBaseService } from '@HRVacanciesServices/HRVacanciesServices';
import { generatePageMetadata } from '@lib/generateMetadata';

import { VacancyEdit } from './components/VacancyEdit';

type EditPageProps = {
  params: {
    vacancyId: string;
  };
};
type Props = {
  params: Promise<{ locale: string; vacancyId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, vacancyId } = await params;
  const t = await getTranslations('Card');
  const vacancy = await vacancyBaseService(vacancyId);

  return generatePageMetadata({
    locale,
    namespace: 'vacancyEdit',
    title: `${t('edit')}: ${vacancy!.title}`,
    path: `profile/hr/vacancies/vacancyId`,
    noIndex: true,
  });
}

export default async function EditPage({ params }: EditPageProps) {
  const { vacancyId } = await params;

  const vacancy = await vacancyBaseService(vacancyId);

  if (!vacancy || !vacancy.isOwner) {
    redirect('/');
  }
  return <VacancyEdit vacancy={vacancy} />;
}
