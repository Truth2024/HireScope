import { useTranslations } from 'next-intl';

import { Loader } from '@ui';

type StatisticsProps = {
  isLoading: boolean;
  total: number;
  totalPages: number;
  currentPage: number;
};

export const Statistics = ({ isLoading, currentPage, total, totalPages }: StatisticsProps) => {
  const t = useTranslations('Card');
  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center ">
      <h2 className="text-lg font-semibold flex items-center">
        {t('candidates')} {isLoading ? <Loader size="xs" /> : `(${total})`}
      </h2>
      <span className="px-2 py-1 bg-(--color-brand)/20 text-(--color-brand) rounded-full text-sm">
        {t('page')} {totalPages !== 0 ? `${currentPage}/${totalPages}` : '0/0'}
      </span>
    </div>
  );
};
