'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';

import { Logo } from '@components';

type ToasterCandidateProps = {
  id: string;
  type: 'accepted' | 'rejected';
  vacancyId: string;
  title: string;
  company: string;
  message: string;
};

export const ToasterCandidate = ({
  id,
  type,
  vacancyId,
  title,
  company,
  message,
}: ToasterCandidateProps) => {
  const config = {
    accepted: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonColor: 'text-green-600 hover:text-green-700',
    },
    rejected: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonColor: 'text-red-600 hover:text-red-700',
    },
  };

  const styles = config[type];

  return (
    <div
      className={`
      flex items-start gap-3 
      ${styles.bgColor} border ${styles.borderColor} 
      rounded-xl shadow-lg p-4 min-w-70 max-w-90
    `}
    >
      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Logo height={16} width={16} />
          <span className="text-xs font-medium text-gray-600">{company}</span>
        </div>

        <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>

        <div className={`text-sm ${type === 'accepted' ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </div>
      </div>

      <Link
        href={`/vacancies/${vacancyId}`}
        onClick={() => toast.dismiss(id)}
        className={`text-xs font-medium ${styles.buttonColor} hover:underline shrink-0`}
      >
        Открыть
      </Link>
    </div>
  );
};
