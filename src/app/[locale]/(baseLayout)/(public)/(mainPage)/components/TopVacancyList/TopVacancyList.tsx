import { VacancyCard } from '@components';
import type { IVacancy } from '@myTypes/mongoTypes';

type TopVacancyListProps = {
  vacancy: IVacancy[];
};

export const TopVacancyList = ({ vacancy }: TopVacancyListProps) => {
  return (
    <div className="content">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {vacancy.map((item) => (
          <li key={item.id}>
            <VacancyCard vacancy={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
