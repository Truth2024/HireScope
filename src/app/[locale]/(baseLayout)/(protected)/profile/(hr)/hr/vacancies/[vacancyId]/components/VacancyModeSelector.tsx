'use client';

import { LayoutGroup, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useVacancyCandidatesCount } from '@hooks/useVacancyCandidatesCount';
import { normalizePath } from '@lib/utils';
import { siteNavigation } from '@siteNav';

type VacancyModeSelectorProps = {
  vacancyId: string;
  initialCandidatesCount?: number;
};

export const VacancyModeSelector = ({
  vacancyId,
  initialCandidatesCount = 0,
}: VacancyModeSelectorProps) => {
  const t = useTranslations('Card');
  const pathname = usePathname();

  const { data: count, isLoading } = useVacancyCandidatesCount(vacancyId);

  const displayCount = isLoading ? initialCandidatesCount : count;

  const normalizedPath = normalizePath(pathname);

  const isEditActive = normalizedPath === siteNavigation.hr.vacancyEdit(vacancyId);
  const isCandidatesActive =
    normalizedPath === siteNavigation.hr.vacancyCandidates(vacancyId) ||
    normalizedPath.startsWith(siteNavigation.hr.vacancyCandidates(vacancyId) + '/');

  return (
    <div className="w-full">
      <LayoutGroup id="vacancy-mode">
        <div className="content">
          <div className="flex w-full p-1 bg-gray-200 rounded-xl mb-6 gap-1 relative">
            <Link
              href={siteNavigation.hr.vacancyEdit(vacancyId)}
              className="flex-1 relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer z-10 text-center flex items-center justify-center"
              scroll={false}
            >
              <span
                className={`relative z-20 block w-full text-center ${
                  isEditActive ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('edit')}
              </span>
              {isEditActive && (
                <motion.div
                  layoutId="active-mode-bg"
                  className="absolute inset-0 bg-(--color-brand) rounded-lg shadow-sm z-10"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
            </Link>

            <Link
              href={siteNavigation.hr.vacancyCandidates(vacancyId)}
              className="flex-1 relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer z-10 flex items-center justify-center"
              scroll={false}
            >
              <span
                className={`relative z-20 flex items-center justify-center gap-2 ${
                  isCandidatesActive ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('candidates')}

                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                    isCandidatesActive ? 'bg-white/20' : 'bg-gray-500/20'
                  }`}
                >
                  {displayCount}
                </span>
              </span>
              {isCandidatesActive && (
                <motion.div
                  layoutId="active-mode-bg"
                  className="absolute inset-0 bg-(--color-brand) rounded-lg shadow-sm z-10"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
            </Link>
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
};
