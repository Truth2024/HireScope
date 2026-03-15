'use client';
import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { cn, getErrorMessage } from '@lib/utils';
import { ActionButton } from '@ui';

type DescriptionChangerProps = {
  initialDescription: string;
  setDescription: (description: string) => void;
  error?: string;
};

const MIN_DESCRIPTION_LENGTH = 20;

export const DescriptionChanger = observer(
  ({ initialDescription, setDescription, error }: DescriptionChangerProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const t = useTranslations('Card');

    const descriptionLength = initialDescription.trim().length;

    if (!isEditing) {
      return (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
              {t('description')}
            </h2>
            <ActionButton action="edit" onClick={() => setIsEditing(true)} />
          </div>
          {initialDescription ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {initialDescription}
            </p>
          ) : (
            <p className="text-gray-400 italic">{t('Validation.empty')}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={initialDescription}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className={cn(
              'w-full px-4 py-3 bg-white border rounded-xl transition-all resize-none focus:outline-none focus:ring-2',
              error
                ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                : 'border-gray-200 focus:ring-(--color-brand)/20 focus:border-(--color-brand)'
            )}
            placeholder={t('Validation.placeholder', { min: MIN_DESCRIPTION_LENGTH })}
            autoFocus
          />
          <div className="absolute bottom-3 right-3 text-xs flex gap-0.5">
            <span
              className={cn(
                'font-medium',
                !error ? 'text-green-600' : descriptionLength > 0 ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {descriptionLength}
            </span>
            <span className="text-gray-400">/{MIN_DESCRIPTION_LENGTH}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-1">{getErrorMessage(t, error)}</p>}
      </div>
    );
  }
);
