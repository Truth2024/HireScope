import { useState, useEffect, useRef, useCallback } from 'react';

import type { IStory } from '../types/story';

export const useStories = (stories: IStory[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const openStory = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setProgress(0);
  }, []);

  const closeStory = useCallback(() => {
    setIsOpen(false);
    setCurrentIndex(0);
    setProgress(0);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const goToNextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      closeStory();
    }
  }, [currentIndex, stories.length, closeStory]);

  const goToPrevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const setProgressManually = useCallback((index: number, percentage: number) => {
    setCurrentIndex(index);
    setProgress(percentage);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      if (progressIntervalRef.current !== null) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Управление прогрессом
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const currentStory = stories[currentIndex];
    const duration = currentStory.duration ?? 5000;

    if (timerRef.current !== null) clearTimeout(timerRef.current);
    if (progressIntervalRef.current !== null) clearInterval(progressIntervalRef.current);

    timerRef.current = window.setTimeout(goToNextStory, duration - (progress / 100) * duration);

    const updateInterval = 20;
    startTimeRef.current = Date.now() - (progress / 100) * duration;

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      if (newProgress >= 100 && progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, updateInterval);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [currentIndex, isOpen, isPaused, stories, goToNextStory, progress]);

  return {
    isOpen,
    currentIndex,
    progress,
    isPaused,
    openStory,
    closeStory,
    goToNextStory,
    goToPrevStory,
    setProgressManually,
    togglePause,
    setIsPaused,
  };
};
