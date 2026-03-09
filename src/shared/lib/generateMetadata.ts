import { baseMetadata } from '@siteConfig';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type GenerateMetadataProps = {
  locale: string;
  namespace?: string;
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  images?: string[];
};

export async function generatePageMetadata({
  locale,
  namespace = 'default',
  title,
  description,
  path = '',
  keywords = [],
  noIndex = false,
  images = [],
}: GenerateMetadataProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'SEO' });

  const fullPath = path ? `/${locale}${path}` : `/${locale}`;

  // Если title не передан, используем из namespace
  const pageTitle = title || t(`${namespace}.title`);

  // Если description не передан, используем из namespace
  const pageDescription = description || t(`${namespace}.description`);

  // Базовые ключевые слова + из параметров
  const baseKeywords = t('keywords').split(',');
  const allKeywords = [...baseKeywords, ...keywords];

  const metadata: Metadata = {
    ...baseMetadata,
    title: pageTitle ? `${pageTitle} | ${t('siteName')}` : t('defaultTitle'),
    description: pageDescription,
    keywords: allKeywords.length > 0 ? allKeywords : undefined,
    alternates: {
      canonical: fullPath,
      languages: {
        ru: `/ru${path}`,
        en: `/en${path}`,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : baseMetadata.robots,
  };

  // Добавляем Open Graph если есть изображения
  if (images.length > 0 && metadata.openGraph) {
    metadata.openGraph.images = images.map((url) => ({
      url,
      width: 1200,
      height: 630,
    }));
  }

  return metadata;
}

// Специализированные генераторы для разных типов страниц

export async function generateVacancyMetadata(
  locale: string,
  vacancy: {
    title: string;
    company?: string;
    description: string;
    requirements?: string[];
    id: string;
  }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return generatePageMetadata({
    locale,
    namespace: 'vacancy',
    title: t('vacancy.title', {
      title: vacancy.title,
    }),
    description: vacancy.description.substring(0, 160),
    path: `/vacancies/${vacancy.id}`,
    keywords: [vacancy.title, ...(vacancy.requirements || [])],
  });
}

export async function generateCandidateMetadata(
  locale: string,
  candidate: {
    firstName: string;
    secondName: string;
    skills?: string[];
    id: string;
  }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'SEO' });
  const fullName = `${candidate.firstName} ${candidate.secondName}`;
  const skillsString = candidate.skills?.join(', ') || '';

  return generatePageMetadata({
    locale,
    namespace: 'candidate',
    title: t('candidate.title', {
      firstName: candidate.firstName,
      secondName: candidate.secondName,
    }),
    description: t('candidate.description', { skills: skillsString }),
    path: `/candidates/${candidate.id}`,
    keywords: [fullName, ...(candidate.skills || [])],
  });
}
