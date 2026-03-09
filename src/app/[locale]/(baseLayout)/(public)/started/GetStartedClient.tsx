'use client';

import { useTranslations } from 'next-intl';

import { CTA } from './components/CTA';
import { Header } from './components/Header';
import { StepsList } from './components/StepsList';

export default function GetStartedClient() {
  const t = useTranslations('GetStarted');

  return (
    <div className="min-h-screen py-20 bg-gray-50/50 overflow-hidden">
      <div className="content">
        <Header t={t} />
        <StepsList t={t} />
        <CTA t={t} />
      </div>
    </div>
  );
}
