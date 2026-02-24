import { getTranslations } from 'next-intl/server';

import { Card, SectionTitle } from '@ui';

import { RegisterClient } from './RegisterClient';

export default async function RegisterPage() {
  const t = await getTranslations('Auth');
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <div className="py-5">
        <Card className="w-full max-w-md mx-auto p-6">
          <SectionTitle title={t('regtitle')} className="justify-center" />
          <RegisterClient />
        </Card>
      </div>
    </div>
  );
}
