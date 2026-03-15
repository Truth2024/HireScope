'use client';

import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import { cn, getErrorMessage } from '@lib/utils';
import { ActionButton, Input } from '@ui';

type CompanyChangerProps = {
  initialCompany: string;
  setCompany: (title: string) => void;
  error?: string;
};

export const CompanyChanger = observer(
  ({ initialCompany, setCompany, error }: CompanyChangerProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const t = useTranslations('Card');
    const hasError = !!error;

    if (!isEditing) {
      return (
        <div className="flex items-center justify-between">
          {!initialCompany ? (
            <h1 className="text-base sm:text-lg  text-gray-400 italic">{t('companyEmpty')}</h1>
          ) : (
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {initialCompany}
            </h1>
          )}

          <ActionButton action="edit" onClick={() => setIsEditing(true)} />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <Input
            className={cn(
              'bg-white',
              hasError &&
                'border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
            )}
            value={initialCompany}
            onChange={setCompany}
            placeholder={t('placeholderCompanyChanger')}
            autoFocus
          />

          {error && <p className="text-sm text-red-500 mt-1">{getErrorMessage(t, error)}</p>}
        </div>
      </div>
    );
  }
);
