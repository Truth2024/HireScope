'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Profile } from '@headerComponents';

import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';

import { CandidatesIcon, HomeIcon, VacanciesIcon } from './Icons';

const ActiveNav = () => {
  const pathname = usePathname();
  const t = useTranslations('Header');

  return (
    <nav className="flex flex-1 justify-between sm:justify-end items-center gap-5 sm:gap-6">
      <Link href="/" className={getLinkClasses('/', pathname)}>
        <span className="hidden sm:inline">{t('nav.home')}</span>
        <span className="sm:hidden text-white">
          <HomeIcon />
        </span>
      </Link>
      <Link href="/vacancies" className={getLinkClasses('/vacancies', pathname)}>
        <span className="hidden sm:inline">{t('nav.vacancies')}</span>
        <span className="sm:hidden text-white">
          <VacanciesIcon />
        </span>
      </Link>
      <Link href="/candidates" className={getLinkClasses('/candidates', pathname)}>
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

export const getLinkClasses = (href: string, pathname: string) => {
  const base =
    'text-white font-medium text-sm sm:text-base no-underline transition-colors duration-300 hover:text-(--color-brand-hover) whitespace-nowrap pb-1';
  const active = 'opacity-100 border-b-2 border-(--color-brand)';
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/') || '/';
  if (href === '/') {
    return pathnameWithoutLocale === href ? `${base} ${active}` : base;
  }
  return pathnameWithoutLocale.startsWith(href) ? `${base} ${active}` : base;
};
