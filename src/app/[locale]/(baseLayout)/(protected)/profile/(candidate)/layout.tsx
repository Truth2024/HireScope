import { ProfileNavCandidate } from './components/ProfileNavCandidate/ProfileNavCandidate';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <ProfileNavCandidate />

      {children}
    </div>
  );
}
