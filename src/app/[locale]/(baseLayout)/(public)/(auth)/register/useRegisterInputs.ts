import { useTranslations } from 'next-intl';

import type { FormField } from './RegisterFormStore';

export const useRegisterInputs = () => {
  const t = useTranslations('Auth');
  return [
    { name: 'firstName' as FormField, type: 'text', placeholder: t('regname') },
    { name: 'surname' as FormField, type: 'text', placeholder: t('regsurname') },
    { name: 'secondName' as FormField, type: 'text', placeholder: t('regpatronymic') },
    { name: 'email' as FormField, type: 'email', placeholder: t('email') },
    { name: 'password' as FormField, type: 'password', placeholder: t('pass') },
    { name: 'confirm' as FormField, type: 'password', placeholder: t('confirm') },
  ];
};
