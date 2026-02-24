import Link from 'next/link';

import { Logo } from '@components';
import { ActiveNav } from '@headerComponents';

export default function Header() {
  return (
    <header className="h-20 flex items-center bg-black">
      <div className="content flex items-center w-full">
        <Link href="/" className="shrink-0 max-[568px]:mr-3">
          <Logo height={40} width={40} />
        </Link>

        <ActiveNav />
      </div>
    </header>
  );
}
