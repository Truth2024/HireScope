import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Skills, DateInfo, VacancySalary, Rating, Logo } from '@components';
import { COMMENTS_LIMIT } from '@constants/constants';
import { generateVacancyMetadata } from '@lib/generateMetadata';
import { Card, ErrorComponent } from '@ui';

import { vacancyServiceById } from '../services/vacancyService';

import { Comments, VacancyDescription, VacancyNotFound } from './components';
import { VacancyApply } from './components/VacancyApply/VacancyApply';

type VacancyPageProps = {
  params: Promise<{ vacancyId: string; locale: string }>;
};

export async function generateMetadata({ params }: VacancyPageProps): Promise<Metadata> {
  const { vacancyId, locale } = await params;
  const result = await vacancyServiceById(vacancyId);
  if (result.status === 'success') {
    return generateVacancyMetadata(locale, {
      title: result.data.title,
      description: result.data.description,
      requirements: result.data.requirements,
      id: result.data.id,
    });
  }

  if (result.status === 'notFound') {
    const t = await getTranslations({ locale, namespace: 'SEO' });
    return {
      title: t('notFound.title'),
      description: t('notFound.description'),
    };
  }

  return {
    title: '500',
    description: 'error',
  };
}

export default async function VacancyPage({ params }: VacancyPageProps) {
  const { vacancyId } = await params;

  const result = await vacancyServiceById(vacancyId);

  if (result.status === 'notFound') {
    return <VacancyNotFound />;
  }

  if (result.status === 'error') {
    return <ErrorComponent code={result.code} />;
  }

  const t = await getTranslations('Card');

  return (
    <div className="py-10">
      <div className="content">
        <Card>
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">
              {result.data.title}
            </h1>
            <Rating rating={result.data.rating} variant="large" />
          </div>

          <span className="bg-(--color-brand)/10 text-(--color-brand) px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 mb-6 w-fit">
            <Logo height={20} width={20} />
            {result.data.company}
          </span>

          <div className="mb-8 flex justify-between items-center max-[480px]:flex-col max-[480px]:gap-4">
            <VacancySalary salary={result.data.salary} variant="large" />
            <VacancyApply
              vacancyId={result.data.id}
              isOwner={result.data.isOwner}
              hasApplied={result.data.hasApplied}
            />
          </div>

          <div className="border-t border-gray-100 my-6" />

          <VacancyDescription descr={result.data.description} />
          <Skills skills={result.data.requirements} title={t('requirements')} variant="full" />

          <div className="border-t border-gray-100 my-6" />
          <DateInfo date={result.data.createdAt} title={t('posted')} className="text-end" />
        </Card>

        <Comments
          commentsCount={result.data.commentsCount}
          comments={result.data.comments || []}
          vacancyId={result.data.id}
          rating={result.data.rating}
          ratingDistribution={result.data.ratingDistribution}
          currentPage={1}
          totalPages={Math.ceil(result.data.commentsCount / COMMENTS_LIMIT)}
        />
      </div>
    </div>
  );
}
