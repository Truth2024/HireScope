'use client';

import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { MatchScoreBar } from '@HRVacancyCandidateComponents';
import { Avatar, DateInfo, Skills } from '@components';
import type { ICandidate } from '@myTypes/mongoTypes';
import { siteNavigation } from '@siteNav';
import { ActionButton, Button, Card } from '@ui';

type VacancyCandidateCardProps = {
  candidate: ICandidate;
  onAccept: (candidateId: string) => void;
  onReject: (candidateId: string) => void;
  onAddNote: (candidate: ICandidate) => void;
  isAcceptLoading?: boolean;
  isRejectLoading?: boolean;
};

export const VacancyCandidateCard = observer(
  ({
    candidate,
    onAccept,
    onReject,
    onAddNote,
    isAcceptLoading,
    isRejectLoading,
  }: VacancyCandidateCardProps) => {
    const t = useTranslations('Card');
    if (!candidate.user) return null;
    return (
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="flex gap-3 sm:gap-4 flex-1 min-w-0 w-full lg:w-auto">
            <Avatar
              firstName={candidate.user.firstName || ''}
              secondName={candidate.user.secondName || ''}
              avatar={candidate.user.avatar || ''}
              blurPhoto={candidate.user.avatarBlur}
              size="large"
            />

            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight wrap-break-word">
                {candidate.user.firstName} {candidate.user.secondName}
              </h3>

              <Link
                href={`mailto:${candidate.user.email}`}
                className="block truncate hover:text-(--color-brand) transition-colors text-xs sm:text-sm text-gray-700 mt-1 max-w-full"
                title={candidate.user.email}
              >
                {candidate.user.email}
              </Link>

              {candidate.matchScore != null && candidate.matchScore > 0 && (
                <div className="mt-2 max-w-50 sm:max-w-62.5 md:max-w-full">
                  <MatchScoreBar title={t('matchScore')} score={candidate.matchScore} />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-end lg:items-end gap-3 w-full lg:w-auto mt-2 lg:mt-0">
            <div className="flex flex-row sm:flex-row lg:flex-col gap-2 w-full sm:w-auto flex-wrap">
              <ActionButton
                action="check"
                label={t('actions.accept')}
                onClick={() => onAccept(candidate.id)}
                className="flex-1 sm:flex-initial"
                isLoading={isAcceptLoading}
              />
              <ActionButton
                action="delete"
                label={t('actions.reject')}
                onClick={() => onReject(candidate.id)}
                className="flex-1 sm:flex-initial"
                isLoading={isRejectLoading}
              />
              <ActionButton
                action="edit"
                label={t('actions.addNote')}
                onClick={() => onAddNote(candidate)}
                className="flex-1 sm:flex-initial"
              />
            </div>

            <Button
              href={siteNavigation.hr.candidateDetail(candidate.user.id)}
              className="w-full sm:w-auto lg:w-full mt-0 sm:mt-2 lg:mt-4"
            >
              {t('moreDetails')}
            </Button>
          </div>
        </div>

        <Skills skills={candidate.user.skills} />

        {candidate.notes && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-700 wrap-break-word">
            <span className="font-medium">{t('notes')}:</span> {candidate.notes}
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500 flex justify-end">
          <DateInfo date={candidate.appliedAt} title={t('appliedAt')} />
        </div>
      </Card>
    );
  }
);
