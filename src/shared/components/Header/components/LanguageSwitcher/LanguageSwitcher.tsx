'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const switchLocale = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLocale('en')}
        className={`
          w-7 h-7 text-xs font-medium rounded transition-all duration-300
          ${
            currentLocale === 'en'
              ? 'bg-(--color-brand) text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }
        `}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('ru')}
        className={`
          w-7 h-7 text-xs font-medium rounded transition-all duration-300
          ${
            currentLocale === 'ru'
              ? 'bg-(--color-brand) text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }
        `}
      >
        RU
      </button>
    </div>
  );
}
