'use client';

import { CameraIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Avatar } from '@components';
import { cn } from '@lib/utils';
import type { AuthStore } from '@store/AuthStore/AuthStore';

type AvatarWithUploadProps = {
  firstName: string;
  secondName: string;
  avatar: string | null;
  size?: 'small' | 'medium' | 'large';
  store: AuthStore;
};

export const AvatarWithUpload: React.FC<AvatarWithUploadProps> = ({
  firstName,
  secondName,
  avatar,
  size = 'medium',
  store,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Error');
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await store.fetchWithAuth('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errorKey) {
          toast.error(t(data.errorKey));
        } else {
          toast.error(t('uploadFailed'));
        }
        return;
      }

      store.setAvatar(data.user.avatar);
      toast.success(`${t('successAvatar')}`);
    } catch {
      toast.error(`${t('failedAvatar')}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative group">
      <div
        onClick={handleAvatarClick}
        className={cn(
          'cursor-pointer transition-opacity duration-200',
          isUploading ? 'opacity-50' : 'group-hover:opacity-90'
        )}
      >
        <Avatar firstName={firstName} secondName={secondName} avatar={avatar} size={size} />
      </div>

      <div
        onClick={handleAvatarClick}
        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
      >
        <CameraIcon className={cn('text-white', size === 'large' ? 'w-8 h-8' : 'w-5 h-5')} />
      </div>

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'border-3 border-white border-t-transparent rounded-full animate-spin',
              size === 'large' ? 'w-10 h-10' : 'w-6 h-6'
            )}
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
