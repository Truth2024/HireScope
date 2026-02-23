import { Card, SectionTitle } from '@ui';

import { LoginClient } from './LoginClient';

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <Card>
        <SectionTitle title="Login" className="justify-center" />
        <LoginClient />
      </Card>
    </div>
  );
}
