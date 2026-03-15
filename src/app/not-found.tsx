import '@styles/global.scss';
import { useTranslations } from 'next-intl';

import { ButtonNotFound } from '@components';

export default function NotFound() {
  const t = useTranslations('NotFoundPage');

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-[#0f172a]">
      <div className="absolute inset-0 z-0">
        <div className="water-canvas absolute inset-0 bg-linear-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] opacity-80" />

        <div className="water-canvas absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-600 blur-[150px] animate-pulse delay-700" />
        </div>
      </div>

      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="3" seed="5">
            <animate
              attributeName="baseFrequency"
              dur="12s"
              values="0.012 0.03; 0.015 0.05; 0.012 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>

          <feDisplacementMap in="SourceGraphic" scale="45" />
        </filter>
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="relative group">
          <h1
            className="text-[12rem] md:text-[18rem] font-black leading-none select-none tracking-tighter"
            style={{
              filter: 'url(#liquid-refraction)',
              background: 'linear-gradient(180deg, #e0e7ff 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </h1>

          <div className="absolute inset-0 blur-3xl bg-indigo-500/20 -z-10 scale-150" />
        </div>

        <div className="mb-8 mt-6 space-y-6 animate-fade-in delay-500">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{t('title')}</h2>

          <p className="text-indigo-200/70 max-w-lg text-lg md:text-xl leading-relaxed">
            {t('description')}
          </p>

          <div className="pt-4">
            <ButtonNotFound text={t('backHome')} />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="cloud cloud-slow opacity-20" />
        <div className="cloud cloud-fast opacity-10" />
      </div>
    </div>
  );
}
