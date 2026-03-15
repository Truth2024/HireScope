'use client';

import { useTranslations } from 'next-intl';

import { Experience, Avatar, Skills } from '@components';
import type { IUser } from '@myTypes/mongoTypes';
import { siteNavigation } from '@siteNav';
import { Button, Card } from '@ui';

type CandidateCardProps = {
  candidate: IUser;
};

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const t = useTranslations('Card');
  return (
    <Card className="gap-4 min-h-85.75 flex flex-col">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            size="small"
            avatar={candidate.avatar ?? null}
            blurPhoto={candidate.avatarBlur ?? null}
            secondName={candidate.secondName}
            firstName={candidate.firstName}
          />

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 break-all hyphens-auto">
              {candidate.firstName} <br />
              {candidate.secondName}
            </h3>
          </div>
        </div>

        <div className="border-t border-gray-100 my-1" />

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400 truncate">
            {t('experience')}
          </span>
          <Experience experience={candidate.experience} variant="compact" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400 truncate">
            {t('skills')}
          </span>
          <Skills skills={candidate.skills} variant="compact" />
        </div>
      </div>

      <Button
        href={siteNavigation.candidateDetail(candidate.id)}
        variant="primary"
        className="mt-4 truncate"
      >
        {t('viewprofile')}
      </Button>
    </Card>
  );
};

export default CandidateCard;
