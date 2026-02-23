import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

import '@styles/global.scss';
import { StoreProvider } from '@providers/StoreProvider';

const nunito = Nunito({
  variable: '--font-family',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HireScope',
  description: 'Платформа для подбора персонала и поиска вакансий с аналитикой и AI-инсайтами',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${nunito.variable} antialiased min-h-screen`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
