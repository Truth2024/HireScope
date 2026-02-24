export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-1 bg-gradient-to-br from-gray-50 via-gray-100 to-indigo-50 py-10 sm:py-16">
        <div className="m-auto bg-white rounded-xl shadow-lg flex flex-col w-full max-w-3xl py-12 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
