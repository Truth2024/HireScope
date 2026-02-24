import { useTranslations } from 'next-intl';

export const useLoginInputs = () => {
  const t = useTranslations('Auth');

  return [
    {
      name: 'identifier',
      type: 'text',
      placeholder: t('email'),
    },
    {
      name: 'password',
      type: 'password',
      placeholder: t('pass'),
    },
  ];
};
