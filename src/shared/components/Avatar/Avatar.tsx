'use client';
import Image from 'next/image';
type AvatarProps = {
  firstName: string;
  secondName: string;
  avatar: string | null;
  size?: 'small' | 'medium' | 'large';
};

function Avatar({ firstName, secondName, avatar, size = 'large' }: AvatarProps) {
  const styleText = size === 'large' ? 'text-4xl md:text-5xl' : 'text-xl';
  const styleRound = size === 'large' ? 'w-24 h-24' : 'w-14 h-14';

  return (
    <div
      className={`${styleRound} rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg shrink-0`}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={firstName}
          fill
          sizes="(max-width: 768px) 96px, 96px"
          className="object-cover"
          priority={false}
        />
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
