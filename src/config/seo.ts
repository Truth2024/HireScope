import type { Metadata } from 'next';

const siteConfig = {
  name: 'HireScope',
  description: 'Платформа для поиска работы и сотрудников. Тысячи вакансий и кандидатов.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://HireScope.com',
  ogImage: 'https://hhcdn.ru/file/18320865.jpg',
  twitterImage: 'https://hhcdn.ru/file/18320865.jpg',
  keywords: ['работа', 'вакансии', 'поиск работы', 'работадатели', 'карьера'],
  authors: [{ name: 'HireScope' }],
  creator: 'HireScope',
  publisher: 'HireScope',
  locale: 'ru_RU',
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Найдите работу мечты`,
    template: `%s`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
