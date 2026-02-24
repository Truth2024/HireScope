import { getTranslations } from 'next-intl/server';

import { Card, SectionTitle } from '@ui';

import { LoginClient } from './LoginClient';

export default async function LoginPage() {
  const t = await getTranslations('Auth');
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <Card className="w-full max-w-md mx-auto p-6">
        <SectionTitle title={t('logintitle')} className="justify-center" />
        <LoginClient />
      </Card>
    </div>
  );
}
