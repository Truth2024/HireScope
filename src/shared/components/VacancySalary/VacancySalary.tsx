import type { ISalary } from '@myTypes/mongoTypes';

type VacancySalaryProps = {
  salary: ISalary | null | undefined;
  variant?: 'compact' | 'large';
};

const formatMoney = (value: number) => `$${value.toLocaleString()}`;

export const VacancySalary = ({ salary, variant = 'large' }: VacancySalaryProps) => {
  const textSize = variant === 'large' ? 'text-2xl font-bold' : 'text-base font-semibold';

  if (!salary || (!salary.min && !salary.max)) {
    return (
      <span className={variant === 'large' ? 'text-base text-gray-400' : 'text-sm text-gray-400'}>
        Salary not specified
      </span>
    );
  }

  if (salary.min && salary.max) {
    return (
      <div className="flex items-baseline gap-1">
        <span className={`${textSize} text-(--color-brand)`}>{formatMoney(salary.min)}</span>
        <span className="text-gray-400 mx-1">—</span>
        <span className={`${textSize} text-(--color-brand)`}>{formatMoney(salary.max)}</span>
      </div>
    );
  }

  if (salary.min) {
    return (
      <span className={`${textSize} text-(--color-brand)`}>From {formatMoney(salary.min)}</span>
    );
  }

  if (salary.max) {
    return (
      <span className={`${textSize} text-(--color-brand)`}>Up to {formatMoney(salary.max)}</span>
    );
  }

  return null;
};
