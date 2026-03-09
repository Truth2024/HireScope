'use client';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useStore } from '@providers/StoreProvider';

import RegisterFormStore from './RegisterFormStore';
import { RegisterForm } from './components/RegisterForm';
import { RoleSelector } from './components/RoleSelector';

export const RegisterClient = observer(() => {
  const t = useTranslations('Auth');
  const registerStore = useLocalObservable(() => new RegisterFormStore());
  const { authStore } = useStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerStore.validation()) {
      const response = await registerStore.register();

      authStore.setUser(response.user, response.accessToken);
      window.location.href = '/';
    }
  };

  return (
    <>
      <RoleSelector
        activeRole={registerStore.role}
        onRoleChange={(role: string) => registerStore.setField('role', role)}
        t={t}
      />

      <RegisterForm store={registerStore} onSubmit={handleSubmit} />
    </>
  );
});
