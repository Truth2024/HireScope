'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
type IStory = {
  id: string;
  image: string;
  duration?: number;
};

const stories: IStory[] = [
  {
    id: '1',
    image:
      'https://www.dropbox.com/scl/fi/ibfw89emnjprdcsecgker/1.png?rlkey=v0antk0jakfzkwqy8vqkw0zix&st=ixyfqz3q&dl=1',
    duration: 5000,
  },
  {
    id: '2',
    image:
      'https://www.dropbox.com/scl/fi/w2l1s2ua02jljkuvpxogz/2.png?rlkey=blu6k279d04drxjm1nj73900i&st=exv79izq&dl=1',
    duration: 5000,
  },
  {
    id: '3',
    image:
      'https://www.dropbox.com/scl/fi/o2pu0qr9faig3pemdyx1s/3.png?rlkey=8zn5f6ktct3ys80azz497tghh&st=o2k5algl&dl=1',
    duration: 5000,
  },
  {
    id: '4',
    image:
      'https://www.dropbox.com/scl/fi/u0i5el8kez6hmld1k6knp/4.png?rlkey=1djp1fp5d008tit74vxaieipj&st=pga4wf5i&dl=1',
    duration: 5000,
  },
];

export default function MiniStories() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const openStory = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setProgress(0);
  };

  const closeStory = () => {
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
  };

  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const goToPrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

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
  }, [currentIndex, isOpen, isPaused]);
  useEffect(() => {
    if (isOpen) {
      // Блокируем прокрутку
      document.body.style.overflow = 'hidden';
    } else {
      // Разблокируем
      document.body.style.overflow = '';
    }

    return () => {
      // На случай, если компонент размонтируется
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
  }, [isOpen, currentIndex]);

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);
  const handleMouseLeave = () => setIsPaused(false);

  const handleProgressBarClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const bar = e.currentTarget as HTMLDivElement;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setCurrentIndex(index);
    setProgress(percentage);
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
