'use client';

import { useFormatter, useTranslations } from 'next-intl';

type DateInfoProps = {
  date: string;
  title: string;
  className?: string;
};

const DateInfo = ({ date, className, title }: DateInfoProps) => {
  const t = useTranslations('Date');
  const format = useFormatter();

  const formattedDate = date
    ? format.dateTime(new Date(date), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : t('recently');

  return (
    <p className={`text-sm text-gray-400 ${className}`}>
      {title} {formattedDate}
    </p>
  );
};

export default DateInfo;
