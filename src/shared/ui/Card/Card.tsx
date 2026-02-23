import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`bg-white h-full flex flex-col border border-gray-200 rounded-2xl p-6 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
