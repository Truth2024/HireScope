'use client';
import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import type { ExperienceChangerStore } from '@experienceStore/ExperienceChangerStore';
import type { ExperienceItemWithMeta } from '@myTypes/mongoTypes';
import { ActionButton } from '@ui';

import { EditForm } from './components/EditForm/EditForm';

type ExperienceEditorItemProps = {
  store: ExperienceChangerStore;
  item: ExperienceItemWithMeta;
};

export const ExperienceEditorItem = observer(({ store, item }: ExperienceEditorItemProps) => {
  const t = useTranslations('Card');
  const [isVisible, setIsVisible] = React.useState(item.isNew ?? false);

  const toggle = () => {
    setIsVisible((prev) => !prev);
  };

  const deleteExpItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.id) {
      store.delete(item.id);
    }
  };

  return (
    <div
      className={`
      bg-white rounded-xl border ${item.isNew ? 'border-(--color-brand)' : 'border-gray-200'}
      overflow-hidden transition-all duration-200
    `}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={toggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{item.position || t('newPosition')}</span>
            {item.company && (
              <span className="text-sm text-gray-500">
                {t('at')} {item.company}
              </span>
            )}
          </div>
          {item.years !== 0 && item.years && (
            <span className="text-xs text-gray-400">{t('years', { count: item.years })}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            action="delete"
            variant="ghost"
            size="sm"
            iconOnly
            onClick={deleteExpItem}
          />
          <ActionButton
            action={isVisible ? 'chevronUp' : 'chevronDown'}
            variant="ghost"
            size="sm"
            iconOnly
          />
        </div>
      </div>

      {isVisible && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <EditForm store={store} item={item} />
        </div>
      )}
    </div>
  );
});
