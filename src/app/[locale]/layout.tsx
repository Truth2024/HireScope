import { Nunito } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Suspense } from 'react';

import { routing } from '@i18n/routing';
import QueryProvider from '@providers/QueryProvider';
import { StoreProvider } from '@providers/StoreProvider';

import '@styles/global.scss';

import RootLoading from './loading';

const nunito = Nunito({
  variable: '--font-family',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${nunito.variable} antialiased min-h-screen`}>
        <Suspense fallback={<RootLoading />}>
          <NextIntlClientProvider locale={locale}>
            <QueryProvider>
              <StoreProvider>{children}</StoreProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
