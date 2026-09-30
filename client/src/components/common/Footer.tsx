import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 border-t border-[#e0dfdc] dark:border-[#383b40] bg-white dark:bg-[#1d2226] text-xs text-slate-500 dark:text-slate-400 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
          <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
            <span className="text-[#0a66c2] dark:text-[#70b5f9]">Linked</span>
            <span className="bg-[#0a66c2] dark:bg-[#70b5f9] text-white dark:text-slate-900 px-1 py-0.5 rounded-[2px] text-[10px]">in</span>
            <span className="ml-1 text-[11px] font-normal text-slate-500 dark:text-slate-400">© 2025</span>
          </div>
          <Link to="/about" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">
            About
          </Link>
          <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">
            Accessibility
          </a>
          <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">
            Help Center
          </a>
          <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">
            Privacy & Terms
          </a>
          <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">
            Ad Choices
          </a>
          <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">
            Advertising
          </a>
          <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">
            Business Services
          </a>
          <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">
            Get the LinkedIn App
          </a>
        </div>
      </div>
    </footer>
  );
};
