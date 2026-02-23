import { VacancyCard } from '@components';
import { Section, SectionTitle } from '@ui';
import type { IVacancy } from 'src/shared/types/mongoTypes';

export default async function VacanciesPage() {
  const vacancies = await fetchVacancies();

  return (
    <div className="py-10">
      <Section>
        <SectionTitle title="Vacancies" />
        <div className="content">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vacancies.map((item) => (
              <li key={item.id}>
                <VacancyCard vacancy={item} />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}

const fetchVacancies = async (): Promise<IVacancy[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vacancy/`, {
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
    return [];
  }
};
