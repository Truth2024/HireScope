import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'always',
});
export const { usePathname, useRouter } = createNavigation(routing);
export type Locale = (typeof routing.locales)[number];
