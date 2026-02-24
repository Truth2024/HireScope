'use client';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useStore } from '@providers/StoreProvider';
import { Button, Input } from '@ui';

import RegisterFormStore from './RegisterFormStore';
import { useRegisterInputs } from './useRegisterInputs';

export const RegisterClient = observer(() => {
  const t = useTranslations('Auth');
  const registerInputs = useRegisterInputs();
  const registerStore = useLocalObservable(() => new RegisterFormStore());
  const { authStore } = useStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerStore.validation()) {
      const data = await registerStore.register();

      if (data.user && data.accessToken) {
        authStore.setUser(data.user, data.accessToken);
        window.location.href = '/';
      }
    }
  };

  const handleInputChange = (name: keyof typeof registerStore.errors, value: string) => {
    registerStore.setField(name, value);
  };

  return (
    <>
      <form
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-5"
        id="regForm"
        onSubmit={handleSubmit}
      >
        {registerInputs.map((item) => {
          const name = item.name as keyof typeof registerStore.errors;

          const fullWidthFields = ['secondName', 'email', 'password', 'confirm'];
          const isFullWidth = fullWidthFields.includes(item.name);

          return (
            <div key={name} className={isFullWidth ? 'md:col-span-2' : ''}>
              <Input
                type={item.type}
                placeholder={item.placeholder}
                value={registerStore[name] as string}
                onChange={(value) => handleInputChange(name, value)}
              />

              {registerStore.errors[name] && (
                <span className="text-sm text-red-500 block mt-1 wrap-break-word">
                  {registerStore.errors[name]}
                </span>
              )}
            </div>
          );
        })}
      </form>
      <div className="flex flex-col items-center gap-5">
        <Link
          href={'/login'}
          className="hover:text-(--color-brand-hover) transition-colors duration-300"
        >
          {t('regdescr')}
        </Link>
        {registerStore.errorServer && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full text-center wrap-break-word">
            {registerStore.errorServer}
          </div>
        )}
        <Button className="w-full" form="regForm" type="submit">
          {t('regbutton')}
        </Button>
      </div>
    </>
  );
});
