import Link from 'next/link';

import { siteNavigation } from '@siteNav';
import { Button } from '@ui';

export const CandidateNotFound = () => {
  return (
    <div className="content flex flex-1">
      <div className="flex flex-col items-center justify-center py-20 flex-1">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Candidate not found</h2>
        <p className="text-gray-500 mb-6">
          The candidate you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href={siteNavigation.candidates}>
          <Button variant="primary">Back to candidates</Button>
        </Link>
      </div>
    </div>
  );
};
