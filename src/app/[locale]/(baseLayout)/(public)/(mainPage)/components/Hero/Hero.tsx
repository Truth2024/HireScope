import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Logo } from '@components';
import { Button } from '@ui';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <section className="w-full max-w-392 px-4 mx-auto flex flex-col flex-1 h-full pb-10">
      <div
        className="w-full flex flex-col justify-center flex-1 rounded-2xl bg-cover bg-no-repeat bg-center py-8.75"
        style={{ backgroundImage: 'url(https://hhcdn.ru/file/18320865.jpg)' }}
      >
        <div className="content min-h-full flex flex-col max-[480px]:flex-col-reverse">
          <div className="max-[480px]:hidden mb-7.5">
            <Logo />
          </div>

          <div className="flex flex-1 items-center max-[480px]:mb-10">
            <div className="flex flex-1 flex-col justify-between">
              <div className="mb-2">
                <h1 className="text-white text-5xl font-bold leading-[1.1] mb-4">
                  <p>{t('title1')}</p>
                  <p>{t('title2')}</p>
                  <p>{t('title3')}</p>
                </h1>

                <p className="text-white/90 text-[18px] leading-normal">{t('description1')}</p>
                <p className="text-white/90 text-[18px] leading-normal">{t('description2')}</p>
              </div>

              <div className="w-full text-white text-[14px] mb-7.5">
                {t('terms.text')}{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="underline transition-colors duration-200 hover:text-indigo-600"
                >
                  {t('terms.termsLink')}
                </Link>{' '}
                &{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="underline transition-colors duration-200 hover:text-indigo-600"
                >
                  {t('terms.privacyLink')}
                </Link>
                .
              </div>
              <div className="flex gap-6">
                <Button>{t('buttons.getStarted')}</Button>
                <Button variant="secondary">{t('buttons.exploreJobs')}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
