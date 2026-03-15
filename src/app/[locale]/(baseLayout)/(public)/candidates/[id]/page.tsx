'use server';

import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Avatar, DateInfo, Skills, Experience } from '@components';
import { generateCandidateMetadata } from '@lib/generateMetadata';
import { siteNavigation } from '@siteNav';
import { Button, Card, ErrorComponent } from '@ui';

import { CandidateNotFound } from './components/CandidateNotFound/CandidateNotFound';
import { fetchCandidateById } from './services/candidateService';

type UserCandidatePageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: UserCandidatePageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const result = await fetchCandidateById(id);

  if (result.status !== 'success') {
    const t = await getTranslations({ locale, namespace: 'SEO' });
    return { title: t('notFound.title'), description: t('notFound.description') };
  }

  return generateCandidateMetadata(locale, {
    firstName: result.data.firstName,
    secondName: result.data.secondName,
    skills: result.data.skills,
    id,
  });
}

const UserCandidatePage = async ({ params }: UserCandidatePageProps) => {
  const { id } = await params;
  const [result, t] = await Promise.all([fetchCandidateById(id), getTranslations('Card')]);

  if (result.status === 'error') return <ErrorComponent code={result.code} />;
  if (result.status === 'notFound') return <CandidateNotFound />;

  const user = result.data;

  return (
    <div className="py-10">
      <div className="content">
        <Card>
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center mb-3 sm:mb-8">
            <Avatar
              firstName={user.firstName}
              secondName={user.secondName}
              avatar={user.avatar ?? null}
              blurPhoto={user.avatarBlur ?? null}
              size="large"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  {user.firstName} {user.secondName}
                </h1>
              </div>

              {user.email && (
                <div className="space-y-1">
                  <Link
                    href={`mailto:${user.email}`}
                    className="text-gray-600 hover:text-(--color-brand) transition-colors"
                  >
                    {user.email}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 my-4 sm:my-6" />

          <section className="mb-3 sm:mb-8">
            <Skills skills={user.skills} title={t('skills')} variant="full" />
          </section>

          <section className="mb-3 sm:mb-8">
            <Experience experience={user.experience} variant="full" />
          </section>

          <div className="border-t border-gray-100 my-4 sm:my-6" />

          <div className="flex justify-between items-center">
            <DateInfo date={user.createdAt} title={t('memberSince')} />
            {user.isOwner && (
              <Button href={siteNavigation.candidate.main} variant="primary">
                {t('edit')}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserCandidatePage;
