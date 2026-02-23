import { Skills, DateInfo, VacancySalary, Rating, Logo } from '@components';
import { Button, Card } from '@ui';
import type { IVacancy } from 'src/shared/types/mongoTypes';

import { Comments, VacancyDescription, VacancyNotFound } from './components';

type VacancyPageProps = {
  params: {
    vacancyId: string;
  };
};

const VacancyPage = async ({ params }: VacancyPageProps) => {
  const { vacancyId } = await params;
  const vacancy = await fetchVacancy(vacancyId);

  if (!vacancy) {
    return <VacancyNotFound />;
  }

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

          <div className="mb-8 flex justify-between items-center max-[480px]:flex-col max-[480px]:gap-4 ">
            <VacancySalary salary={vacancy.salary} variant="large" />
            <Button variant="primary">Apply now</Button>
          </div>

          <div className="border-t border-gray-100 my-6" />

          <VacancyDescription descr={vacancy.description} />
          <Skills skills={vacancy.requirements} title="Requirements" variant="full" />

          <div className="border-t border-gray-100 my-6" />
          <DateInfo date={vacancy.createdAt} title="Posted" className="text-end" />
        </Card>
        <Comments vacancy={vacancy} />
      </div>
    </div>
  );
};

const fetchVacancy = async (vacancyId: string): Promise<IVacancy | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vacancy/${vacancyId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    return null;
  }
};
export default VacancyPage;
