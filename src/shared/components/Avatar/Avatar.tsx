'use client';
import Image from 'next/image';
import { useState } from 'react';

import { Loader } from '@ui';

type AvatarProps = {
  firstName: string;
  secondName: string;
  avatar: string | null;
  blurPhoto?: string | null;
  size?: 'small' | 'medium' | 'large';
};

function Avatar({ firstName, secondName, avatar, blurPhoto, size = 'large' }: AvatarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const styleText = size === 'large' ? 'text-3xl md:text-4xl' : 'text-xl';
  const styleRound = size === 'large' ? 'w-24 h-24' : 'w-14 h-14';

  const imgSrc = avatar ?? blurPhoto ?? null;

  return (
    <div
      className={`${styleRound} rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg shrink-0 relative`}
    >
      {imgSrc && !hasError ? (
        <>
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader size={size === 'large' ? 'l' : 'm'} />
            </div>
          )}

          <Image
            src={imgSrc}
            alt={firstName}
            fill
            sizes="(max-width: 768px) 96px, 96px"
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />

          {blurPhoto && !avatar && (
            <div className="absolute inset-0 backdrop-blur-xs bg-white/10" />
          )}
        </>
      ) : (
        <div className="w-full h-full bg-linear-to-br from-(--color-brand)/20 to-(--color-brand)/5 flex items-center justify-center">
          <span className={`font-semibold text-(--color-brand) ${styleText}`}>
            {firstName[0].toUpperCase()}
            {secondName[0].toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

export default Avatar;
