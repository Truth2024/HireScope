import { CandidateCard } from '@components';
import type { IUser } from 'src/shared/types/mongoTypes';

type TopCandidateListProps = {
  newUsersCandidate: IUser[];
};

export const TopCandidateList = ({ newUsersCandidate }: TopCandidateListProps) => {
  return (
    <div className="content">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newUsersCandidate.map((item) => (
          <li key={item.id}>
            <CandidateCard candidate={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
