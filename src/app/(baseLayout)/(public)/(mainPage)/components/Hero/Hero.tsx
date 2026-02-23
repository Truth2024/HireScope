import Link from 'next/link';

import { Logo } from '@components';
import { Button } from '@ui';

export const Hero = () => {
  return (
    <section className="w-full max-w-392 px-4 mx-auto flex flex-col flex-1 h-full pb-10">
      <div
        className="w-full flex flex-col justify-center flex-1 rounded-2xl bg-cover bg-no-repeat bg-center py-8.75"
        style={{ backgroundImage: 'url(https://hhcdn.ru/file/18320865.jpg)' }}
      >
        <div className="content min-h-full flex flex-col max-[480px]:flex-col-reverse">
          <div className="flex justify-between items-center mb-10 max-[480px]:flex-col max-[480px]:gap-2 max-[480px]:mb-0 max-[480px]:items-start">
            <div className="max-[480px]:hidden">
              <Logo />
            </div>
            <div className="flex gap-6">
              <Button>Get Started</Button>
              <Button variant="secondary">Explore Jobs</Button>
            </div>
          </div>

          <div className="flex flex-1 items-center max-[480px]:mb-10">
            <div className="flex flex-1 flex-col justify-between">
              <div className="mb-2 max-w-129.5">
                <h1 className="text-white text-5xl max-[480px]:text-2xl font-bold leading-[1.1] mb-4">
                  Find talent. Track progress. Hire smarter.
                </h1>
                <p className="text-white/90 text-[18px] leading-normal">
                  A modern recruitment platform with analytics and
                </p>
                <p className="text-white/90 text-[18px] leading-normal">
                  intelligent matching built for teams and candidates.
                </p>
              </div>

              <div className="w-full text-white text-[14px]">
                By using HireScope, you accept our{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="underline transition-colors duration-200 hover:text-indigo-600"
                >
                  Terms
                </Link>{' '}
                &{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="underline transition-colors duration-200 hover:text-indigo-600"
                >
                  Privacy
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
