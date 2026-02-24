import Link from 'next/link';

import { Button } from '@ui';

export const VacancyNotFound = () => (
  <div className="content flex flex-1">
    <div className="flex flex-col items-center justify-center py-20 flex-1">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Vacancy not found</h2>
      <p className="text-gray-500 mb-6">
        The vacancy you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link href="/vacancies">
        <Button variant="primary">Back to vacancies</Button>
      </Link>
    </div>
  </div>
);
