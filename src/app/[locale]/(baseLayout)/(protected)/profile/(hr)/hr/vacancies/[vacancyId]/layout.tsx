import React from 'react';

import { VacancyModeSelector } from './components/VacancyModeSelector';

type VacancyLayoutProps = {
  children: React.ReactNode;
  params: { vacancyId: string };
};

export default async function VacancyLayout({ children, params }: VacancyLayoutProps) {
  const { vacancyId } = await params;

  return (
    <div className="pb-10">
      <VacancyModeSelector vacancyId={vacancyId} />
      {children}
    </div>
  );
}
