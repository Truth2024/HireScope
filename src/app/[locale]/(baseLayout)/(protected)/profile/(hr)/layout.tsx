import { ProfileNavHR } from './components/ProfileNavHR/ProfileNavHR';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <ProfileNavHR />

      {children}
    </div>
  );
}
