import { CandidateCard } from '@components';
import type { IUser } from '@myTypes/mongoTypes';

type TopCandidateListProps = {
  newUsersCandidate: IUser[];
};

export const TopCandidateList = ({ newUsersCandidate }: TopCandidateListProps) => {
  return (
    <div className="content">
      <ul className="grid gap-6 grid-cols-1 min-[757px]:grid-cols-2 min-[1341px]:grid-cols-4">
        {newUsersCandidate.map((item) => (
          <li key={item.id} className="min-w-75 w-full">
            <CandidateCard candidate={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
