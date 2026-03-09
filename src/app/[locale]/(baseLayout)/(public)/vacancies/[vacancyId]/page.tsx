import { getTranslations } from 'next-intl/server';

import { Skills, DateInfo, VacancySalary, Rating, Logo } from '@components';
import { COMMENTS_LIMIT } from '@constants/constants';
import { Card } from '@ui';

import { vacancyServiceById } from '../services/vacancyService';

import { Comments, VacancyDescription, VacancyNotFound } from './components';
import { VacancyApply } from './components/VacancyApply/VacancyApply';

type VacancyPageProps = {
  params: {
    vacancyId: string;
  };
};

export default async function VacancyPage({ params }: VacancyPageProps) {
  const { vacancyId } = await params;

  const vacancy = await vacancyServiceById(vacancyId);

  if (!vacancy) {
    return <VacancyNotFound />;
  }

  const t = await getTranslations('Card');

  return (
    <div className="py-10">
      <div className="content">
        <Card>
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">{vacancy.title}</h1>
            <Rating rating={vacancy.rating} variant="large" />
          </div>

          <span className="bg-(--color-brand)/10 text-(--color-brand) px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 mb-6 w-fit">
            <Logo height={20} width={20} />
            {vacancy.company}
          </span>

          <div className="mb-8 flex justify-between items-center max-[480px]:flex-col max-[480px]:gap-4">
            <VacancySalary salary={vacancy.salary} variant="large" />
            <VacancyApply vacancyId={vacancy.id} />
          </div>

          <div className="border-t border-gray-100 my-6" />

          <VacancyDescription descr={vacancy.description} />
          <Skills skills={vacancy.requirements} title={t('requirements')} variant="full" />

          <div className="border-t border-gray-100 my-6" />
          <DateInfo date={vacancy.createdAt} title={t('posted')} className="text-end" />
        </Card>

        <Comments
          commentsCount={vacancy.commentsCount}
          comments={vacancy.comments}
          vacancyId={vacancy.id}
          rating={vacancy.rating}
          ratingDistribution={vacancy.ratingDistribution}
          currentPage={1}
          totalPages={Math.ceil(vacancy.commentsCount / COMMENTS_LIMIT)}
        />
      </div>
    </div>
  );
}
