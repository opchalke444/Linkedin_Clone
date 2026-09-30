import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-xl border bg-white dark:bg-[#282c31] px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] disabled:bg-slate-50 dark:disabled:bg-[#1d2226] disabled:text-slate-500 ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-rose-300 dark:border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-[#383b40] hover:border-slate-300 dark:hover:border-slate-600'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
