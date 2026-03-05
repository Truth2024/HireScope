'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Experience } from '@components';
import { ExperienceChangerStore } from '@experienceStore/ExperienceChangerStore';
import type { AuthStore } from '@store/AuthStore/AuthStore';
import { ActionButton, Button, Loader } from '@ui';

import { ExperienceEditorItem } from './components/ExperienceEditorItem/ExperienceEditorItem';

type ExperienceChangerProps = {
  store: AuthStore;
  className?: string;
};

export const ExperienceChanger = observer(({ store, className = '' }: ExperienceChangerProps) => {
  const t = useTranslations('Card');
  const experienceChangerStore = useLocalObservable(() => new ExperienceChangerStore(t));
  const user = store.user;

  React.useEffect(() => {
    if (store.user && store.user.experience) {
      experienceChangerStore.setExp(store.user.experience);
    }
  }, [store.user]);

  if (!user) return null;

  if (!experienceChangerStore.isEditing) {
    return (
      <div className={`relative group ${className}`}>
        <Experience experience={user.experience} />
        <ActionButton
          action="edit"
          showText="mobile-hidden"
          position="absolute"
          onClick={() => experienceChangerStore.setIsEditing(true)}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
          {t('experience')}
        </h2>

        <ActionButton
          action="add"
          variant="ghost"
          onClick={() => experienceChangerStore.addEmpty()}
          label={t('add')}
        />
      </div>

      <div className="space-y-3 mb-6">
        {experienceChangerStore.myExp.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">{t('noExperienceAdd')}</p>
          </div>
        ) : (
          experienceChangerStore.myExp.map((item) => (
            <ExperienceEditorItem key={item.id} store={experienceChangerStore} item={item} />
          ))
        )}
      </div>
      {experienceChangerStore.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            {experienceChangerStore.error}
          </p>
        </div>
      )}
      <div className="flex items-center justify-end gap-3">
        <Button onClick={() => experienceChangerStore.cancel(user.experience)} variant="cancel">
          {t('cancel')}
        </Button>
        <Button onClick={() => experienceChangerStore.savingExp(store)}>
          {experienceChangerStore.isLoading ? <Loader size="s" color="white" /> : t('save')}
        </Button>
      </div>
    </div>
  );
});
