import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { siteNavigation } from '@siteNav';
import { Button, Input, Loader } from '@ui';

import type { ErrorField, FormField } from '../RegisterFormStore';
import type RegisterFormStore from '../RegisterFormStore';
import { useRegisterInputs } from '../useRegisterInputs';

type RegisterFormProps = {
  store: RegisterFormStore;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const RegisterForm = observer(({ store, onSubmit }: RegisterFormProps) => {
  const registerInputs = useRegisterInputs();
  const t = useTranslations('Auth');
  return (
    <>
      <form
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-5"
        id="regForm"
        onSubmit={onSubmit}
      >
        {registerInputs.map((item) => {
          const name = item.name as FormField;

          const isFullWidth = ['secondName', 'email', 'password', 'confirm'].includes(name);
          const fieldValue = (store as unknown as Record<FormField, string>)[name];

          return (
            <div key={name} className={isFullWidth ? 'md:col-span-2' : ''}>
              <Input
                type={item.type}
                placeholder={item.placeholder}
                value={fieldValue}
                onChange={(value) => store.setField(name, value)}
              />

              {name !== 'role' && store.errors[name as ErrorField] && (
                <span className="text-sm text-red-500 block mt-1">
                  {store.errors[name as ErrorField]}
                </span>
              )}
            </div>
          );
        })}
      </form>
      <div className="flex flex-col items-center gap-5">
        <Link
          href={siteNavigation.login}
          className="hover:text-(--color-brand-hover) transition-colors text-sm"
        >
          {t('regdescr')}
        </Link>

        {store.errorServer && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full text-center text-sm">
            {store.errorServer}
          </div>
        )}

        <Button className="w-full" form="regForm" type="submit" disabled={store.isLoading}>
          {store.isLoading ? <Loader color="white" /> : t('regbutton')}
        </Button>
      </div>
    </>
  );
});
