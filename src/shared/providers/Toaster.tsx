'use client';
import { Toaster } from 'react-hot-toast';

export default function ToasterProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        reverseOrder={true}
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
}
