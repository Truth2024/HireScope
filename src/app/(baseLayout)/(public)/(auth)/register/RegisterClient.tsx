'use client';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Link from 'next/link';
import React from 'react';

import { useStore } from '@providers/StoreProvider';
import { Button, Input } from '@ui';

import RegisterFormStore from './RegisterFormStore';
import { registerInputs } from './registerInputs';

export const RegisterClient = observer(() => {
  const registerStore = useLocalObservable(() => new RegisterFormStore());
  const { authStore } = useStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerStore.validation()) {
      try {
        const data = await registerStore.register();

        if (data.user && data.accessToken) {
          authStore.setUser(data.user, data.accessToken);
          window.location.href = '/';

          // toast.success('Успешная регистрация!');
        }
      } catch {}
    }
  };
  const handleInputChange = (name: keyof typeof registerStore.errors, value: string) => {
    switch (name) {
      case 'firstName':
        registerStore.setFirstName(value);
        break;
      case 'surname':
        registerStore.setSurname(value);
        break;
      case 'secondName':
        registerStore.setSecondName(value);
        break;
      case 'email':
        registerStore.setEmail(value);
        break;
      case 'password':
        registerStore.setPassword(value);
        break;
      case 'confirm':
        registerStore.setConfirm(value);
        break;
    }
  };
  return (
    <>
      <form
        className="max-w-122.5 grid grid-cols-2 gap-4 mb-5"
        id="regForm"
        onSubmit={handleSubmit}
      >
        {registerInputs.map((item) => {
          const name = item.name as keyof typeof registerStore.errors;

          const fullWidthFields = ['secondName', 'email', 'password', 'confirm'];
          const isFullWidth = fullWidthFields.includes(item.name);

          return (
            <div key={name} className={isFullWidth ? 'col-span-2' : ''}>
              <Input
                type={item.type}
                placeholder={item.placeholder}
                value={registerStore[name]}
                onChange={(value) => handleInputChange(name, value)}
              />
              {registerStore.errors[name] && (
                <span className="text-sm text-red-500 max-w-70">{registerStore.errors[name]}</span>
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
          Already have an account?
        </Link>
        {registerStore.errorServer && <span>{registerStore.errorServer.toString()}</span>}
        <Button className="w-full" form="regForm" type="submit">
          Зарегистрироваться
        </Button>
      </div>
    </>
  );
});
