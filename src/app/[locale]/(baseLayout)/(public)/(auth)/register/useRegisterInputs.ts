import { useTranslations } from 'next-intl';

export const useRegisterInputs = () => {
  const t = useTranslations('Auth');
  return [
    { name: 'firstName', type: 'text', placeholder: t('regname') },
    { name: 'surname', type: 'text', placeholder: t('regsurname') },
    { name: 'secondName', type: 'text', placeholder: t('regpatronymic') },
    { name: 'email', type: 'email', placeholder: t('email') },
    { name: 'password', type: 'password', placeholder: t('pass') },
    { name: 'confirm', type: 'password', placeholder: t('confirm') },
  ];
};
