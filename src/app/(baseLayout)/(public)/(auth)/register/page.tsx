import { Card, SectionTitle } from '@ui';

import { RegisterClient } from './RegisterClient';

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <Card>
        <SectionTitle title="Register" className="justify-center" />
        <RegisterClient />
      </Card>
    </div>
  );
}
