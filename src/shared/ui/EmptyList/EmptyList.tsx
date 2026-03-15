'use client';

import { useTranslations } from 'next-intl';

type EmptyListProps = {
  type: 'vacancies' | 'candidates' | 'notifications' | 'messages' | 'custom' | 'candidatesHR';
  customTitle?: string;
  customDescription?: string;
  icon?: 'vacancy' | 'candidate' | 'search' | 'folder' | 'inbox';
};

export const EmptyList = ({
  type = 'vacancies',
  customTitle,
  customDescription,
  icon = 'vacancy',
}: EmptyListProps) => {
  const t = useTranslations('Empty');

  const getIconPath = () => {
    switch (icon) {
      case 'candidate':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        );
      case 'search':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        );
      case 'folder':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        );
      case 'inbox':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        );
      default: // vacancy
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        );
    }
  };

  const getTitle = () => {
    if (customTitle) return customTitle;

    switch (type) {
      case 'vacancies':
        return t('vacancies.title');
      case 'candidates':
        return t('candidates.title');
      case 'notifications':
        return t('notifications.title');
      case 'messages':
        return t('messages.title');
      default:
        return t('default.title');
    }
  };

  const getDescription = () => {
    if (customDescription) return customDescription;

    switch (type) {
      case 'vacancies':
        return t('vacancies.description');
      case 'candidates':
        return t('candidates.description');
      case 'notifications':
        return t('notifications.description');
      case 'messages':
        return t('messages.description');
      default:
        return t('default.description');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 mb-6 text-gray-300">
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {getIconPath()}
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{getTitle()}</h3>
      <p className="text-gray-500 max-w-md">{getDescription()}</p>
    </div>
  );
};
