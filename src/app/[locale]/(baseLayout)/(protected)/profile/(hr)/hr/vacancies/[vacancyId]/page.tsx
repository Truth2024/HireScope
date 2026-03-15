import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { vacancyBaseService } from '@HRVacanciesServices/HRVacanciesServices';
import { generatePageMetadata } from '@lib/generateMetadata';
import { EmptyList, ErrorComponent } from '@ui';

import { VacancyEdit } from './components/VacancyEdit';

type EditPageProps = {
  params: Promise<{ vacancyId: string; locale: string }>;
};

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const { locale, vacancyId } = await params;

  const result = await vacancyBaseService(vacancyId);

  if (result.status === 'success') {
    const t = await getTranslations('Card');
    return generatePageMetadata({
      locale,
      namespace: 'vacancyEdit',
      title: `${t('edit')}: ${result.data.title}`,
      path: `profile/hr/vacancies/vacancyId`,
      noIndex: true,
    });
  }

  const t = await getTranslations({ locale, namespace: 'SEO' });
  return {
    title: t('notFound.title'),
    description: t('notFound.description'),
  };
}

export default async function EditPage({ params }: EditPageProps) {
  const { vacancyId } = await params;

  const result = await vacancyBaseService(vacancyId);

  if (result.status === 'error') {
    return <ErrorComponent code={result.code} />;
  }

  if (result.status === 'notFound') {
    return <EmptyList type="vacancies" icon="vacancy" />;
  }

  if (result.status === 'unauthorized') {
    redirect('/');
  }

  if (!result.data.isOwner) {
    redirect('/');
  }

  return <VacancyEdit vacancy={result.data} />;
}
