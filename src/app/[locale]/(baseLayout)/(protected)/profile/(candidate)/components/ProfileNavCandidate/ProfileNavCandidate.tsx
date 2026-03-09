'use client';
import { motion, LayoutGroup } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useStore } from '@providers/StoreProvider';

const NAV_ITEMS = [
  { key: 'profile', href: '/profile/main' },
  { key: 'resumes', href: '/profile/resumes' },
  { key: 'applications', href: '/profile/applications' },
];

const normalizePath = (path: string) => {
  return path.replace(/^\/(ru|en)(\/|$)/, '/').replace(/\/$/, '') || '/';
};

export const ProfileNavCandidate = observer(() => {
  const { authStore } = useStore();
  const rawPathname = usePathname();
  const t = useTranslations('ProfileNavCandidate');

  const currentPath = normalizePath(rawPathname);

  return (
    <nav className="relative w-full border-b border-gray-200 bg-white mb-8 z-(--z-header)">
      <div className="content">
        <div className="flex items-center justify-between">
          <LayoutGroup id="profile-navigation">
            <div className="flex items-center gap-8 h-full relative">
              {NAV_ITEMS.map(({ key, href }) => {
                const isActive = currentPath === normalizePath(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      relative py-5 text-sm font-medium transition-colors whitespace-nowrap inline-block
                      hover:text-(--color-brand-hover)
                      ${isActive ? 'text-(--color-brand)' : 'text-(--gray-font-color)'}
                    `}
                  >
                    {t(key)}

                    {isActive && (
                      <motion.span
                        layoutId="active-nav-line"
                        initial={false}
                        className="absolute left-0 right-0 bottom-0 block h-0.5 z-11 bg-(--color-brand)"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>

          <button
            onClick={() => authStore.logout()}
            className="
              py-5 text-sm font-medium transition-colors cursor-pointer
              text-(--gray-font-color) hover:text-(--color-brand-hover)
            "
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </nav>
  );
});
