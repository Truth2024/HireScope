import type { SoundType } from '@hooks/useSound';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import type { _Translator } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (t: _Translator, errKey?: string) => {
  if (!errKey) return null;

  return t(errKey, { count: 20, min: 20 });
};

export const playNotificationSound = (type: string, playSound: (sound?: SoundType) => void) => {
  switch (type) {
    case 'new_candidate':
      playSound('notification');
      break;
    case 'candidate-accepted':
      playSound('success');
      break;
    case 'candidate-rejected':
      playSound('error');
      break;
    default:
      playSound('notification');
  }
};
