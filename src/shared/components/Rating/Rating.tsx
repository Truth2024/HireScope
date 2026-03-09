import { useTranslations } from 'next-intl';

type RatingProps = {
  rating: number;
  variant?: 'compact' | 'large';
};

export const Rating = ({ rating, variant = 'large' }: RatingProps) => {
  const t = useTranslations('Card');
  const variants = {
    large: {
      wrapper: 'px-3 py-1.5',
      star: 'text-lg',
      text: 'text-lg font-semibold',
      empty: 'text-base',
    },
    compact: {
      wrapper: 'px-2 py-1',
      star: 'text-sm',
      text: 'text-sm font-medium',
      empty: 'text-sm',
    },
  };

  const styles = variants[variant];

  if (rating === 0) {
    return <span className={`text-gray-400 italic ${styles.empty}`}>{t('noRating')}</span>;
  }
  return (
    <div className={`flex items-center gap-1 bg-amber-50 rounded-full w-fit ${styles.wrapper}`}>
      <span className={`text-(--color-brand) ${styles.star}`}>★</span>
      <span className={`text-gray-700 ${styles.text}`}>{rating.toFixed(1)}</span>
    </div>
  );
};
