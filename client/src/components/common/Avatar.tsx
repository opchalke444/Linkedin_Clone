import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isOnline,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-24 h-24 text-2xl font-bold',
    '2xl': 'w-32 h-32 sm:w-36 sm:h-36 text-3xl font-bold',
  };

  const indicatorSize = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-5 h-5 ring-4',
    '2xl': 'w-6 h-6 ring-4',
  };

  const showFallback = !src || imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-full select-none ${sizeClasses[size]} ${className}`}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover shadow-sm"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-[#e7f1fb] dark:bg-[#1b3a5b] text-[#0a66c2] dark:text-[#70b5f9] border border-[#b4dbf3] dark:border-[#0a66c2]/40 flex items-center justify-center font-bold shadow-sm">
          {getInitials(name || 'User')}
        </div>
      )}

      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-[#1d2226] ${indicatorSize[size]} ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};
