export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-1 bg-linear-to-br from-gray-50 via-gray-100 to-indigo-50 py-0 sm:py-10 md:py-16 px-0 sm:px-0">
        <div className="m-auto bg-white rounded-xl shadow-lg flex flex-col w-full max-w-3xl py-0 px-0 sm:py-12 sm:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
