'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

type EmptyCommentsProps = {
  children: ReactNode;
};

export const EmptyComments = ({ children }: EmptyCommentsProps) => {
  const t = useTranslations('Card');

  return (
    <div className="flex gap-10 justify-between items-stretch flex-col md:flex-row">
      {children}
      <div className="flex-1 bg-gray-50 rounded-xl p-8 text-center flex flex-col justify-center border border-gray-100">
        <span className="text-4xl mb-3 block">💬</span>
        <p className="text-gray-500 mb-1">{t('noComments')}</p>
        <p className="text-sm text-gray-400 mb-5">{t('beFirstToLeaveReview')}</p>
      </div>
    </div>
  );
};
