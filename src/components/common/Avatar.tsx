import React, { useState } from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (parts[0] ? parts[0].slice(0, 2) : 'EM').toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg font-bold',
  }[size];

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`${sizeClasses} rounded-full object-cover border border-emerald-100/80 shadow-xs shrink-0 ${className}`}
      />
    );
  }

  // Graceful fallback with emerald/mint background gradient
  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#047857] to-[#064E3B] text-white font-semibold flex items-center justify-center border border-emerald-200/50 shadow-xs shrink-0 select-none ${className}`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};
