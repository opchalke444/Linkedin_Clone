import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'teal' | 'sky' | 'indigo' | 'emerald' | 'amber' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
}) => {
  const variants = {
    blue: 'bg-blue-50 dark:bg-[#0a66c2]/20 text-[#0a66c2] dark:text-[#70b5f9] border-blue-200/80 dark:border-[#0a66c2]/40',
    teal: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200/80 dark:border-teal-800/60',
    sky: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
