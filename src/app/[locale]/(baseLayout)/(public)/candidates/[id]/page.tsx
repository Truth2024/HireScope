import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Avatar, DateInfo, Skills, Experience } from '@components';
import { Button, Card } from '@ui';
import type { IUser } from 'src/shared/types/mongoTypes';

import { CandidateNotFound } from './components/CandidateNotFound/CandidateNotFound';
type UserCandidatePageProps = {
  params: {
    id: string;
  };
};

const UserCandidatePage = async ({ params }: UserCandidatePageProps) => {
  const { id } = await params;
  const user = await fetchUserCandidate(id);
  const t = await getTranslations('Card');

  if (!user) {
    return <CandidateNotFound />;
  }

  return (
    <div className="py-10">
      <div className="content">
        <Card>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
            <Avatar
              firstName={user.firstName}
              secondName={user.secondName}
              avatar={user.avatar ?? null}
              size="large"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {user.firstName} {user.secondName}
                </h1>
              </div>

              <div className="space-y-1">
                {user.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Link
                      href={`mailto:${user.email}`}
                      className="hover:text-(--color-brand) transition-colors"
                    >
                      {user.email}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6" />

          <section className="mb-8">
            <Skills skills={user.skills} title={t('skills')} variant="full" />
          </section>

          <Experience experience={user.experience} variant="full" />

          <div className="border-t border-gray-100 my-6" />
          <div className="flex justify-between items-center">
            <DateInfo date={user.createdAt} title={t('memberSince')} />
            {user.role === 'hr' && <Button variant="primary">{t('contactCandidate')}</Button>}
          </div>
        </Card>
      </div>
    </div>
  );
};
export default UserCandidatePage;

const fetchUserCandidate = async (userCandidateId: string): Promise<IUser | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/${userCandidateId}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    return null;
  }
};
