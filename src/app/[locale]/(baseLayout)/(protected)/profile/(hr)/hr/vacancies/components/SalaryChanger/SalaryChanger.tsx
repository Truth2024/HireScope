'use client';
import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import { VacancySalary } from '@components';
import { getErrorMessage } from '@lib/utils';
import type { ISalary } from '@myTypes/mongoTypes';
import { ActionButton, Input } from '@ui';

type SalaryChangerProps = {
  initialSalary: ISalary;
  setSalary: (value: string, type: 'min' | 'max') => void;
  error?: string;
};

export const SalaryChanger = observer(({ initialSalary, setSalary, error }: SalaryChangerProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const t = useTranslations('Card');

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <VacancySalary salary={initialSalary} />
        <ActionButton action="edit" onClick={() => setIsEditing(true)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-7">
        <Input
          className="bg-white"
          onChange={(e) => setSalary(e, 'min')}
          value={initialSalary.min?.toString() ?? ''}
          placeholder={t('from')}
        />
        <Input
          className="bg-white"
          onChange={(e) => setSalary(e, 'max')}
          value={initialSalary.max?.toString() ?? ''}
          placeholder={t('to')}
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{getErrorMessage(t, error)}</p>}
    </div>
  );
});
