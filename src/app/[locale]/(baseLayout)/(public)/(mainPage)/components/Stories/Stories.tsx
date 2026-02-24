'use client';
import Image from 'next/image';
import { useEffect } from 'react';

import { useStories } from './hooks/useStrories';
import { stories } from './mockData/mockData';

export default function Stories() {
  const {
    isOpen,
    currentIndex,
    progress,
    isPaused,
    openStory,
    closeStory,
    goToNextStory,
    goToPrevStory,
    setProgressManually,
    setIsPaused,
  } = useStories(stories);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Управление клавишами
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          goToNextStory();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevStory();
          break;
        case 'Escape':
          closeStory();
          break;
        case ' ':
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNextStory, goToPrevStory, closeStory, setIsPaused]);

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);
  const handleMouseLeave = () => setIsPaused(false);

  const handleProgressBarClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const bar = e.currentTarget as HTMLDivElement;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setProgressManually(index, percentage);
  };

  if (!isOpen) {
    return (
      <div className="w-full bg-white">
        <div className="content">
          <div className="flex gap-4 py-3 overflow-x-auto justify-center">
            {stories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => openStory(index)}
                className="w-16 h-16 rounded-full p-0.5 bg-(--color-brand) shrink-0 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <Image
                    src={story.image}
                    alt={`Story ${story.id}`}
                    height={60}
                    width={60}
                    className="rounded-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* Верхняя панель прогресса */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 w-80">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => handleProgressBarClick(index, e)}
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={closeStory}
        className="absolute top-8 right-4 text-(--color-brand) hover:text-(--color-brand-hover) text-3xl z-50 transition-colors"
      >
        ✕
      </button>

      {/* Story container по центру, адаптивный */}
      <div className="relative w-[90vw] max-w-sm aspect-9/16 bg-black rounded-2xl overflow-hidden shadow-2xl">
        <Image src={currentStory.image} alt="Story" fill className="object-cover" />
        {/* Навигация */}
        <div className="absolute inset-0 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevStory();
            }}
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              goToNextStory();
            }}
          />
        </div>

        {/* Индикатор паузы */}
        {isPaused && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            Paused
          </div>
        )}
      </div>

      {/* Нижняя панель */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm flex justify-between w-80">
        <span>
          {currentIndex + 1} / {stories.length}
        </span>
        <span className="flex gap-4">
          <span>← → to navigate</span>
          <span>space to pause</span>
        </span>
      </div>
    </div>
  );
}
