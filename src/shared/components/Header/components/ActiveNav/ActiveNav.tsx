'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Profile } from '../Profile/Profile';

const ActiveNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 justify-end items-center gap-6 max-[568px]:gap-3 max-[568px]:justify-center">
      <Link href="/" className={`${getLinkClasses('/', pathname)}`}>
        Home
      </Link>
      <Link href="/vacancies" className={getLinkClasses('/vacancies', pathname)}>
        Vacancies
      </Link>
      <Link href="/candidates" className={getLinkClasses('/candidates', pathname)}>
        Candidates
      </Link>

      <Profile />
    </nav>
  );
};

export default ActiveNav;
export const getLinkClasses = (href: string, pathname: string) => {
  const base =
    'text-white font-medium text-base no-underline transition-colors duration-300 hover:text-(--color-brand-hover) whitespace-nowrap';
  const active = 'opacity-100 border-b-2 border-(--color-brand)';
  if (href === '/') {
    return pathname === href ? `${base} ${active}` : base;
  }

  if (href === '/login' || href === '/register') {
    return pathname.startsWith('/login') || pathname.startsWith('/register')
      ? `${base} ${active}`
      : base;
  }

  return pathname.startsWith(href) ? `${base} ${active}` : base;
};
