'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Profile } from '@headerComponents';
import { getLinkClasses } from '@lib/utils';
import { siteNavigation } from '@siteNav';

import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';

import { CandidatesIcon, HomeIcon, VacanciesIcon } from './Icons';

const ActiveNav = () => {
  const pathname = usePathname();
  const t = useTranslations('Header');

  return (
    <nav className="flex flex-1 justify-end items-center gap-6">
      <Link href={siteNavigation.home} className={getLinkClasses(siteNavigation.home, pathname)}>
        <span className="hidden sm:inline">{t('nav.home')}</span>
        <span className="sm:hidden text-white">
          <HomeIcon />
        </span>
      </Link>
      <Link
        href={siteNavigation.vacancies}
        className={getLinkClasses(siteNavigation.vacancies, pathname)}
      >
        <span className="hidden sm:inline">{t('nav.vacancies')}</span>
        <span className="sm:hidden text-white">
          <VacanciesIcon />
        </span>
      </Link>
      <Link
        href={siteNavigation.candidates}
        className={getLinkClasses(siteNavigation.candidates, pathname)}
      >
        <span className="hidden sm:inline">{t('nav.candidates')}</span>
        <span className="sm:hidden text-white">
          <CandidatesIcon />
        </span>
      </Link>
      <LanguageSwitcher />
      <Profile />
    </nav>
  );
};

export default ActiveNav;
