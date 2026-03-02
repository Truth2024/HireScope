import Link from 'next/link';

import { Logo } from '@components';
import { ActiveNav } from '@headerComponents';

export default function Header() {
  return (
    <header className="header-height flex items-center bg-black">
      <div className="content flex items-center w-full">
        <Link href="/" className="shrink-0 mr-5">
          <Logo height={40} width={40} />
        </Link>

        <ActiveNav />
      </div>
    </header>
  );
}
