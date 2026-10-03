import React from 'react';

interface SignatureBannerProps {
  title: string;
  subtitle: string;
  badge?: string;
  actions?: React.ReactNode;
}

export const SignatureBanner: React.FC<SignatureBannerProps> = ({
  title,
  subtitle,
  badge,
  actions,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#047857] text-white p-6 sm:p-8 shadow-sm">
      {/* Signature organic mint blob bleeding off top-right corner */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#4EC69A] opacity-35 blur-2xl transform rotate-12"
        style={{
          borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 right-28 w-44 h-44 rounded-full bg-[#4EC69A] opacity-20 blur-xl"
        style={{
          borderRadius: '63% 37% 54% 46% / 30% 60% 40% 70%',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl space-y-1.5">
          {badge && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-emerald-100 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#4EC69A] animate-pulse" />
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            {subtitle}
          </p>
        </div>

        {actions && (
          <div className="relative z-10 flex items-center gap-3 shrink-0 pt-2 md:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
