'use client';

import { useTranslations } from 'next-intl';

import type { CommentsStore } from '@commentsStore';

type CommentsStatsProps = {
  store: CommentsStore;
};

export const CommentsStats = ({ store }: CommentsStatsProps) => {
  const getPercentage = (count: number) => {
    if (store.commentsCount === 0) return 0;
    return (count / store.commentsCount) * 100;
  };
  const t = useTranslations('Card');
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {store.rating > 0 ? store.rating.toFixed(1) : '0.0'}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-(--color-brand) text-lg">★</span>
                <span className="text-sm text-gray-500">{t('avgrate')}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{store.commentsCount}</div>
              <span className="text-sm text-gray-500">{t('allcomments')}</span>
            </div>
          </div>
        </div>
      </div>

      {store.commentsCount > 0 && (
        <div className="w-full">
          {[5, 4, 3, 2, 1].map((ratingValue) => (
            <div key={ratingValue} className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 min-w-10">
                <span className="text-sm font-medium text-gray-600">{ratingValue}</span>
                <span className="text-(--color-brand)">★</span>
              </div>

              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-(--color-brand) rounded-full transition-all duration-300"
                  style={{
                    width: `${getPercentage(
                      store.ratingDistribution[ratingValue as keyof typeof store.ratingDistribution]
                    )}%`,
                  }}
                />
              </div>

              <div className="min-w-7.5 text-right">
                <span className="text-sm font-medium text-gray-600">
                  {store.ratingDistribution[ratingValue as keyof typeof store.ratingDistribution]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
