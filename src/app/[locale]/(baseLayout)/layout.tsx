import { Header } from '@components';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col main">{children}</main>
    </div>
  );
}
