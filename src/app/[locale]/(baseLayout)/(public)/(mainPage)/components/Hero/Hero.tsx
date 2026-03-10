import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Logo } from '@components';
import { Button } from '@ui';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <section className="w-full max-w-392 px-0 min-[579px]:px-4  mx-auto flex flex-col min-[579px]:flex-1 h-full pb-10">
      <div
        className="w-full flex flex-col justify-center flex-1 min-[579px]:rounded-2xl bg-cover bg-no-repeat bg-center min-[579px]:py-8.75 py-20 mobile-hero-bg"
        style={{ backgroundImage: 'url(https://hhcdn.ru/file/18320865.jpg)' }}
      >
        <div className="content min-h-full flex flex-col max-[480px]:flex-col-reverse">
          <div className="max-[480px]:hidden mb-7.5">
            <Logo />
          </div>

          <div className="flex flex-1 items-center min-[579px]:mb-10">
            <div className="flex flex-1 flex-col min-[579px]:items-start items-center justify-between min-[579px]:text-start text-center">
              <div className="mb-2">
                <h1 className="text-white text-5xl font-bold leading-[1.1] mb-4">
                  <p>{t('title1')}</p>
                  <p>{t('title2')}</p>
                  <p>{t('title3')}</p>
                </h1>

                <p className="text-white/90 text-[18px] leading-normal">{t('description1')}</p>
                <p className="text-white/90 text-[18px] leading-normal">{t('description2')}</p>
              </div>

              <div className="w-full text-gray-300 text-[14px] mb-7.5">
                {t('terms.text')}{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="underline transition-colors duration-200 hover:text-white tracking-widest"
                >
                  {t('terms.termsLink')}
                </Link>{' '}
                &{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="underline transition-colors duration-200 hover:text-white tracking-widest"
                >
                  {t('terms.privacyLink')}
                </Link>
                .
              </div>
              <div className="flex gap-6">
                <Button href="/started">{t('buttons.getStarted')}</Button>
                <Button variant="secondary" href="/vacancies">
                  {t('buttons.exploreJobs')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
