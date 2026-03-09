'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';

import { Avatar } from '@components';

type ToasterHRProps = {
  id: string;
  candidateId: string;
  firstName: string;
  secondName: string;
  avatar: string;
  matchScore?: number;
};

export const ToasterHR = ({
  id,
  candidateId,
  firstName,
  secondName,
  avatar,
  matchScore,
}: ToasterHRProps) => {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#dce3eb] rounded-xl shadow-lg p-4 min-w-70 max-w-90">
      <Avatar firstName={firstName} secondName={secondName} avatar={avatar} size="small" />

      <div className="flex-1">
        <div className="text-sm font-semibold text-black">Новый кандидат</div>

        <div className="text-sm text-[#768694]">
          {firstName} {` `} {secondName}
        </div>

        {matchScore !== undefined && (
          <div className="text-xs text-[#6366f1] mt-1">Match: {matchScore}%</div>
        )}
      </div>

      <Link
        href={`/candidates/${candidateId}`}
        onClick={() => toast.dismiss(id)}
        className="text-xs font-medium text-[#6366f1] hover:text-[#4f46e5]"
      >
        Открыть
      </Link>
    </div>
  );
};
