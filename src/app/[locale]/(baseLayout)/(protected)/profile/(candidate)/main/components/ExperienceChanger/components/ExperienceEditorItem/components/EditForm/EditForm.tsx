'use client';
import { observer } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';

import type { ExperienceChangerStore } from '@experienceStore/ExperienceChangerStore';
import type { ExperienceItemWithMeta } from '@myTypes/mongoTypes';
import { Input } from '@ui';

export const EditForm = observer(
  ({ store, item }: { store: ExperienceChangerStore; item: ExperienceItemWithMeta }) => {
    const t = useTranslations('Card');

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('position')}</label>
          <Input
            type="text"
            value={item.position || ''}
            onChange={(value) => store.updateItem(item.id!, 'position', value)}
            placeholder={t('positionPlaceholder') || 'Например: Senior Developer'}
            className={store.getFieldError(item.id!, 'position') ? 'border-red-500' : ''}
          />
          {store.getFieldError(item.id!, 'position') && (
            <p className="text-sm text-red-500 mt-1">{store.getFieldError(item.id!, 'position')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('company')}</label>
          <Input
            type="text"
            value={item.company || ''}
            onChange={(value) => store.updateItem(item.id!, 'company', value)}
            placeholder={t('companyPlaceholder')}
            className={store.getFieldError(item.id!, 'company') ? 'border-red-500' : ''}
          />
          {store.getFieldError(item.id!, 'company') && (
            <p className="text-sm text-red-500 mt-1">{store.getFieldError(item.id!, 'company')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('yearsLabel')}</label>
          <Input
            placeholder={t('yearsPlaceholder')}
            type="text"
            value={String(item.years || '')}
            onChange={(value) => store.updateItem(item.id!, 'years', value)}
            className={store.getFieldError(item.id!, 'years') ? 'border-red-500' : ''}
          />
          {store.getFieldError(item.id!, 'years') && (
            <p className="text-sm text-red-500 mt-1">{store.getFieldError(item.id!, 'years')}</p>
          )}
        </div>

        {store.getFieldError(item.id!, 'form') && (
          <p className="text-sm text-red-500 mt-2 p-2 bg-red-50 rounded">
            {store.getFieldError(item.id!, 'form')}
          </p>
        )}
      </div>
    );
  }
);
