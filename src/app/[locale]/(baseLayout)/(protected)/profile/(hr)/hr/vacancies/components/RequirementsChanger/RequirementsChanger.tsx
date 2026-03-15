'use client';

import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import type { VacancyEditStore } from '@EditVacancyStore/VacancyEditStore';
import { SkillButton, Skills } from '@components';
import { cn, getErrorMessage } from '@lib/utils';
import { ActionButton } from '@ui';

type RequirementsChangerProps = {
  store: VacancyEditStore;
  error?: string;
};

export const RequirementsChanger = observer(({ store, error }: RequirementsChangerProps) => {
  const t = useTranslations('Card');
  const [isEditing, setIsEditing] = React.useState(false);

  const requirements = store.requirements;
  const allSkills = store.allRequirementsOptions;

  const hasSkills = requirements.length > 0;

  if (!isEditing) {
    return (
      <div className="flex justify-between">
        <Skills title={t('requirements')} skills={requirements} />

        <div className="flex items-start">
          <ActionButton action="edit" onClick={() => setIsEditing(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          {t('selectedSkills')}:{' '}
          <span className={cn('font-bold', hasSkills ? 'text-(--color-brand)' : 'text-red-500')}>
            {requirements.length}
          </span>
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {allSkills.map((skill: string) => {
          const isSelected = requirements.includes(skill);
          return (
            <SkillButton
              key={skill}
              text={skill}
              handleClick={() => store.toggleRequirement(skill)}
              isSelected={isSelected}
            />
          );
        })}
      </div>

      {error && !hasSkills && (
        <p className="text-sm text-red-500 mt-1">{getErrorMessage(t, error)}</p>
      )}
    </div>
  );
});
