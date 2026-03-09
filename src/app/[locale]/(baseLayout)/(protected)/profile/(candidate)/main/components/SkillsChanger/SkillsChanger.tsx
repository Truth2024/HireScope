'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import { SkillButton, Skills } from '@components';
import type { AuthStore } from '@store/AuthStore/AuthStore';
import { ActionButton, Button, Loader, type Option } from '@ui';

import { SkillChangerStore } from './store/SkillChangerStore';

type SkillsChangerProps = {
  className?: string;
  authStore: AuthStore;
};

export const SkillsChanger = observer(({ className = '', authStore }: SkillsChangerProps) => {
  const skillsChangerStore = useLocalObservable(() => new SkillChangerStore());

  React.useEffect(() => {
    if (authStore.user) {
      skillsChangerStore.setSkills(authStore.user.skills);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.user]);

  const t = useTranslations('Card');

  if (!authStore.user) return null;

  if (!skillsChangerStore.isEditing) {
    return (
      <div className={`relative group ${className}`}>
        <Skills skills={authStore.user.skills} variant={'full'} />
        <ActionButton
          action="edit"
          variant="ghost"
          showText="mobile-hidden"
          position="absolute"
          onClick={() => skillsChangerStore.setIsEditing(true)}
        />
      </div>
    );
  }
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
        {t('skills')}
      </h2>

      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {skillsChangerStore.allSkillsOptions.map((skill: Option) => {
            const isSelected = skillsChangerStore.mySkills.includes(skill.value);
            return (
              <SkillButton
                key={skill.value}
                text={skill.value}
                handleClick={() => skillsChangerStore.toggleSkill(skill.value)}
                isSelected={isSelected}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button onClick={() => skillsChangerStore.setIsEditing(false)} variant="cancel">
            {t('cancel')}
          </Button>
          <Button onClick={() => skillsChangerStore.savingSkills(authStore)}>
            {skillsChangerStore.isLoading ? <Loader color="white" size="s" /> : t('save')}
          </Button>
        </div>
      </div>
    </div>
  );
});
