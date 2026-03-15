'use client';

import { useTranslations } from 'next-intl';

type ErrorComponentProps = {
  code?: string | number;
};

export const ErrorComponent = ({ code }: ErrorComponentProps) => {
  const t = useTranslations('Error');

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 mb-6 text-red-400">
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {t('title') || 'Произошла ошибка'}
      </h3>
      <p className="text-gray-500 max-w-md">
        {t('description') || 'Попробуйте обновить страницу или повторите попытку позже'}
      </p>
      {code && (
        <div className="mt-4 text-sm text-gray-400">
          {t('code')}: {code}
        </div>
      )}
    </div>
  );
};
