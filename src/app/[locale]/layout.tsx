import { baseMetadata } from '@siteConfig';
import { Nunito } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Suspense } from 'react';

import { routing } from '@i18n/routing';
import { NotificationProvider } from '@providers/NotificationListener';
import QueryProvider from '@providers/QueryProvider';
import { StoreProvider } from '@providers/StoreProvider';
import ToasterProvider from '@providers/Toaster';

import RootLoading from './loading';
import '@styles/global.scss';

const nunito = Nunito({
  variable: '--font-family',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata = baseMetadata;

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
              <StoreProvider>
                <ToasterProvider>
                  <NotificationProvider>{children}</NotificationProvider>
                </ToasterProvider>
              </StoreProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
