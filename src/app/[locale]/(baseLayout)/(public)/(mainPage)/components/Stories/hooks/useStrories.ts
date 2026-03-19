import { useState, useEffect, useRef, useCallback } from 'react';

import type { IStory } from '../types/story';

const STORAGE_KEY = 'viewed-stories';

export const useStories = (stories: IStory[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewedStories, setViewedStories] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {}
      }
    }
    return new Set();
  });

  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (viewedStories.size > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewedStories]));
    }
  }, [viewedStories]);

  const markStoryAsViewed = useCallback(
    (index: number) => {
      const story = stories[index];
      if (!viewedStories.has(story.id)) {
        setViewedStories((prev) => new Set(prev).add(story.id));
      }
    },
    [stories, viewedStories]
  );

  const openStory = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setProgress(0);
  }, []);

  const closeStory = useCallback(() => {
    setIsOpen(false);
    setCurrentIndex(0);
    setProgress(0);

    if (currentIndex >= 0 && currentIndex < stories.length) {
      markStoryAsViewed(currentIndex);
    }

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, [currentIndex, stories.length, markStoryAsViewed]);

  const goToNextStory = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < stories.length) {
      markStoryAsViewed(currentIndex);
    }

    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      closeStory();
    }
  }, [currentIndex, stories.length, closeStory, markStoryAsViewed]);

  const goToPrevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const setProgressManually = useCallback(
    (index: number, percentage: number) => {
      setCurrentIndex(index);
      setProgress(percentage);
      if (percentage >= 99.9) {
        markStoryAsViewed(index);
      }
    },
    [markStoryAsViewed]
  );

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

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

    timerRef.current = window.setTimeout(
      () => {
        goToNextStory();
      },
      duration - (progress / 100) * duration
    );

    const updateInterval = 20;
    startTimeRef.current = Date.now() - (progress / 100) * duration;

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      // Отмечаем как просмотренную, когда прогресс достиг 100%
      if (newProgress >= 100) {
        markStoryAsViewed(currentIndex);

        if (progressIntervalRef.current !== null) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
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
  }, [currentIndex, isOpen, isPaused, stories, goToNextStory, progress, markStoryAsViewed]);

  return {
    isOpen,
    currentIndex,
    progress,
    isPaused,
    viewedStories,
    openStory,
    closeStory,
    goToNextStory,
    goToPrevStory,
    setProgressManually,
    togglePause,
    setIsPaused,
  };
};
