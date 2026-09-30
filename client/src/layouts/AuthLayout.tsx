import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const AuthLayout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#f4f2ee] dark:bg-[#1d2226] text-slate-900 dark:text-[#f3f2ef] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold text-[#0a66c2] tracking-tight">Linked</span>
          <div className="w-7 h-7 rounded-sm bg-[#0a66c2] flex items-center justify-center text-white font-bold text-base leading-none">
            in
          </div>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border border-slate-300 dark:border-[#383b40] bg-white dark:bg-[#23272c] hover:bg-slate-100 dark:hover:bg-[#2e343b] text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          title={`Switch to ${isDark ? 'Day (Light)' : 'Night (Dark)'} mode`}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      {/* Main Form Content */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white dark:bg-[#23272c] py-8 px-6 sm:px-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-none rounded-lg border border-[#e0dfdc] dark:border-[#383b40]">
          <Outlet />
        </div>
      </div>

      {/* Auth Footer */}
      <div className="max-w-7xl mx-auto w-full text-center py-4 text-xs text-slate-500 dark:text-slate-400 space-x-4">
        <span>LinkedIn Corporation © 2026</span>
        <a href="#" className="hover:underline">User Agreement</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Community Guidelines</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
      </div>
    </div>
  );
};
