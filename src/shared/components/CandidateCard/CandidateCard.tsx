import { getTranslations } from 'next-intl/server';

import { Experience, Avatar } from '@components';
import { Button, Card } from '@ui';
import type { IUser } from 'src/shared/types/mongoTypes';

type CandidateCardProps = {
  candidate: IUser;
};

const CandidateCard: React.FC<CandidateCardProps> = async ({ candidate }) => {
  const t = await getTranslations('Card');
  return (
    <Card className="gap-4">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              size="small"
              avatar={candidate.avatar ?? null}
              secondName={candidate.secondName}
              firstName={candidate.firstName}
            />

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {candidate.firstName} {candidate.secondName}
              </h3>
            </div>
          </div>

          <div className="border-t border-gray-100 my-1" />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              {t('experience')}
            </span>
            <Experience experience={candidate.experience} variant="compact" />
          </div>
        </div>

        <Button href={`/candidates/${candidate.id}`} variant="primary" className="mt-4 ">
          {t('viewprofile')}
        </Button>
      </div>
    </Card>
  );
};

export default CandidateCard;
