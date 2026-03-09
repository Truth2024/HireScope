'use client';

import { LayoutGroup, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useVacancyCandidatesCount } from '@hooks/useVacancyCandidatesCount';

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
  const params = useParams();
  const locale = params.locale as string;

  const { data: count, isLoading } = useVacancyCandidatesCount(vacancyId);

  // Показываем initialCount пока грузится, или актуальный count после загрузки
  const displayCount = isLoading ? initialCandidatesCount : count;

  const basePath = `/${locale}/profile/hr/vacancies/${vacancyId}`;
  const editPath = basePath;
  const candidatesPath = `${basePath}/candidates`;

  const isEditActive = pathname === editPath;
  const isCandidatesActive =
    pathname === candidatesPath || pathname.startsWith(candidatesPath + '?');

  return (
    <div className="w-full">
      <LayoutGroup id="vacancy-mode">
        <div className="content">
          <div className="flex w-full p-1 bg-gray-200 rounded-xl mb-6 gap-1 relative">
            {/* Кнопка Edit */}
            <Link
              href={editPath}
              className="flex-1 relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer z-10 text-center"
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

            {/* Кнопка Candidates с counter */}
            <Link
              href={candidatesPath}
              className="flex-1 relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer z-10"
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
