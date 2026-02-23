'use client';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Link from 'next/link';
import React from 'react';

import { useStore } from '@providers/StoreProvider';
import { Button, Input } from '@ui';

import LoginFormStore from './LoginFormStore';
import { loginInputs } from './loginInputs';
export const LoginClient = observer(() => {
  const loginFormStore = useLocalObservable(() => new LoginFormStore());
  const { authStore } = useStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginFormStore.validation()) {
      try {
        const data = await loginFormStore.login();
        if (data.user && data.accessToken) {
          authStore.setUser(data.user, data.accessToken);
          window.location.href = '/';
        }
        // toast.success('Успешный вход');
      } catch {}
    }
  };
  return (
    <>
      <form id="loginForm" className="w-87.5 flex flex-col gap-4 mb-5" onSubmit={handleSubmit}>
        {loginInputs.map((item) => (
          <div key={item.placeholder} className="w-full">
            <Input
              value={
                item.name == 'identifier' ? loginFormStore.identifier : loginFormStore.password
              }
              onChange={(value) => {
                if (item.name === 'identifier') {
                  loginFormStore.setIdentifier(value);
                } else {
                  loginFormStore.setPassword(value);
                }
              }}
              placeholder={item.placeholder}
            />

            {loginFormStore.errors[item.name as 'identifier' | 'password'] && (
              <span>{loginFormStore.errors[item.name as 'identifier' | 'password']}</span>
            )}
          </div>
        ))}
      </form>
      <div className="flex flex-col items-center gap-5">
        <Link
          href={'/register'}
          className="hover:text-(--color-brand-hover) transition-colors duration-300"
        >
          Don’t have an account?
        </Link>
        <Button
          className="w-full"
          form="loginForm"
          // loading={loginFormStore.isLoading}
          // className={styles.formBtn}
          type="submit"
        >
          Войти
        </Button>
      </div>
    </>
  );
});
