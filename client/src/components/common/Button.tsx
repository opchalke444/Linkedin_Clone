import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-[#0a66c2] hover:bg-[#004182] text-white shadow-sm focus:ring-[#0a66c2] border border-transparent',
    secondary:
      'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-sm focus:ring-slate-700 border border-transparent',
    outline:
      'border border-[#0a66c2] hover:border-[#004182] bg-transparent hover:bg-blue-50/80 dark:hover:bg-[#0a66c2]/15 text-[#0a66c2] dark:text-[#70b5f9] dark:border-[#70b5f9] focus:ring-[#0a66c2]',
    ghost:
      'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 focus:ring-slate-300 dark:focus:ring-slate-600',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500 border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
