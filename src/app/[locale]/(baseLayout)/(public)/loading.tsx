import { Loader } from '@ui';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z(--z-modal) flex items-center justify-center bg-white">
      <Loader />
    </div>
  );
}
