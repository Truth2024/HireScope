'use client';

import NextNProgress from 'nextjs-progressbar';

export const ProgressProvider = () => {
  return (
    <NextNProgress
      color="#29D"
      startPosition={0.3}
      stopDelayMs={200}
      height={3}
      showOnShallow={true}
    />
  );
};
