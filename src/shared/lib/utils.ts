import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import type { _Translator } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import type { SoundType } from '@hooks/useSound';
import { siteNavigation } from '@siteNav';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (t: _Translator, errKey?: string) => {
  if (!errKey) return null;

  return t(errKey, { count: 20, min: 20 });
};

export const playNotificationSound = (type: string, playSound: (sound?: SoundType) => void) => {
  switch (type) {
    case 'new_candidate':
      playSound('notification');
      break;
    case 'candidate-accepted':
      playSound('success');
      break;
    case 'candidate-rejected':
      playSound('error');
      break;
    default:
      playSound('notification');
  }
};

const PROFILE_REGEX = /^\/(?:[a-z]{2}\/)?profile/;
const AUTH_REGEX = /^\/(?:[a-z]{2}\/)?(login|register)/;

export const isProfilePage = (pathname: string): boolean => {
  return PROFILE_REGEX.test(pathname);
};

export const isAuthPage = (pathname: string): boolean => {
  return AUTH_REGEX.test(pathname);
};

export const normalizePath = (path: string) => {
  return path.replace(/^\/(ru|en)(\/|$)/, '/').replace(/\/$/, '') || '/';
};

export const getLinkClasses = (href: string, pathname: string) => {
  const base =
    'text-white font-medium text-sm sm:text-base no-underline transition-colors duration-300 hover:text-(--color-brand-hover) whitespace-nowrap pb-1';
  const active = 'opacity-100 border-b-2 border-(--color-brand)';
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/') || '/';
  if (href === siteNavigation.home) {
    return pathnameWithoutLocale === href ? `${base} ${active}` : base;
  }
  return pathnameWithoutLocale.startsWith(href) ? `${base} ${active}` : base;
};

export const formattedDate = (value: string | Date) => {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
