'use client';
import { useQueryClient } from '@tanstack/react-query';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useStore } from '@providers/StoreProvider';
import { siteNavigation } from '@siteNav';
import { Button, Input, Loader } from '@ui';

import LoginFormStore from './LoginFormStore';
import { useLoginInputs } from './useLoginInputs';

export const LoginClient = observer(() => {
  const t = useTranslations('Auth');
  const loginInputs = useLoginInputs();
  const loginFormStore = useLocalObservable(() => new LoginFormStore());
  const { authStore } = useStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginFormStore.validation()) {
      const data = await loginFormStore.login();
      if (data?.user && data?.accessToken) {
        authStore.setUser(data.user, data.accessToken);
        queryClient.clear();
        router.push('/profile');
      }
    }
  };

  return (
    <>
      <form id="loginForm" className="w-full flex flex-col gap-4 mb-5" onSubmit={handleSubmit}>
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

            {loginFormStore.errors[item.name as keyof typeof loginFormStore.errors] && (
              <span className="text-sm text-red-500 block mt-1 wrap-break-word">
                {loginFormStore.errors[item.name as keyof typeof loginFormStore.errors]}
              </span>
            )}
          </div>
        ))}
      </form>
      <div className="flex flex-col items-center gap-5">
        <Link
          href={siteNavigation.register}
          className="hover:text-(--color-brand-hover) transition-colors duration-300"
        >
          {t('logindescr')}
        </Link>
        {loginFormStore.errorServer && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full text-center wrap-break-word">
            {loginFormStore.errorServer}
          </div>
        )}
        <Button className="w-full" form="loginForm" type="submit">
          {loginFormStore.isLoading ? <Loader color="white" /> : t('loginbutton')}
        </Button>
      </div>
    </>
  );
});
