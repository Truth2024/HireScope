'use client';

import { siteNavigation } from '@siteNav';
import { Button } from '@ui';

type ButtonNotFoundProps = {
  text: string;
};
export const ButtonNotFound = ({ text }: ButtonNotFoundProps) => {
  return (
    <Button
      onClick={() => {
        window.location.href = siteNavigation.home;
      }}
      className="shadow-[0_0_20px_rgba(99,102,241,0.4)]"
    >
      {text}
    </Button>
  );
};
