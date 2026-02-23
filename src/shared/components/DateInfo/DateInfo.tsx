type DatePostProps = {
  date: string;
  title: string;
  className?: string;
};

const DateInfo = ({ date, title, className }: DatePostProps) => {
  return (
    <p className={`text-sm text-gray-400 ${className}`}>
      {title}{' '}
      {date
        ? new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'recently'}
    </p>
  );
};
export default DateInfo;
