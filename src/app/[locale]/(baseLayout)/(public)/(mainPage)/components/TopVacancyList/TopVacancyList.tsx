import { VacancyCard } from '@components';
import type { IVacancy } from '@myTypes/mongoTypes';

type TopVacancyListProps = {
  vacancy: IVacancy[];
};

export const TopVacancyList = ({ vacancy }: TopVacancyListProps) => {
  return (
    <div className="content">
      <ul className="grid gap-6 grid-cols-1 min-[757px]:grid-cols-2 min-[1341px]:grid-cols-4">
        {vacancy.map((item) => (
          <li key={item.id} className="min-w-75 w-full">
            <VacancyCard vacancy={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
