'use client';

import { useCallback, useEffect, useRef } from 'react';

export type SoundType = 'notification' | 'success' | 'error';

export const useSound = () => {
  const audioRef = useRef<Record<SoundType, HTMLAudioElement | null>>({
    notification: null,
    success: null,
    error: null,
  });

  useEffect(() => {
    // Инициализируем звуки только на клиенте
    audioRef.current = {
      notification: new Audio('/sounds/notification.mp3'),
      success: new Audio('/sounds/success.mp3'),
      error: new Audio('/sounds/error.mp3'),
    };

    // Настраиваем громкость
    Object.values(audioRef.current).forEach((audio) => {
      if (audio) audio.volume = 0.5;
    });

    // Очистка
    return () => {
      Object.values(audioRef.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playSound = useCallback((type: SoundType = 'notification') => {
    const audio = audioRef.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  return { playSound };
};
