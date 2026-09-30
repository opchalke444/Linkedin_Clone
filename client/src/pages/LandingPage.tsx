import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-[#1d2226] min-h-screen flex flex-col justify-between transition-colors duration-200">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-transparent dark:border-[#383b40]">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl sm:text-3xl font-bold text-[#0a66c2] tracking-tight">Linked</span>
          <div className="w-8 h-8 rounded-sm bg-[#0a66c2] flex items-center justify-center text-white font-bold text-lg leading-none">
            in
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#23272c] border border-slate-200 dark:border-[#383b40] transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Day Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Night Mode</span>
              </>
            )}
          </button>

          <Link
            to="/register"
            className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#23272c] px-3 sm:px-4 py-2 rounded-full transition-colors"
          >
            Join now
          </Link>
          <Link
            to="/login"
            className="text-xs sm:text-sm font-semibold text-[#0a66c2] dark:text-[#70b5f9] border border-[#0a66c2] dark:border-[#70b5f9] hover:bg-blue-50 dark:hover:bg-blue-950/30 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Text & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#0a66c2] dark:text-[#70b5f9] text-xs font-semibold">
            <span>🇮🇳 India Region Edition • Bengaluru, Mumbai, Delhi NCR, Hyderabad & Pune</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#8f5849] dark:text-[#e89a88] sm:leading-[1.15]">
            Welcome to India's{' '}
            <span className="font-semibold text-[#0a66c2] dark:text-[#70b5f9] block sm:inline">
              professional community
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
            Connect with tech leaders, software architects, alumni from IITs, BITS, and NITs, and innovators scaling India's top consumer, SaaS, and FinTech ecosystems.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-semibold rounded-full shadow-sm transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/opportunities"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-[#383b40] hover:bg-slate-50 dark:hover:bg-[#23272c] text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-full transition-colors"
            >
              <Briefcase className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Explore Tech Jobs</span>
            </Link>
          </div>
        </div>

        {/* Right Hero Graphic */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-[#f4f2ee] dark:bg-[#23272c] p-6 rounded-2xl border border-slate-200 dark:border-[#383b40] space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Explore collaborative topics</h3>
            <div className="space-y-2">
              <Link to="/opportunities" className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1d2226] hover:bg-blue-50 dark:hover:bg-[#2a3036] border border-slate-200 dark:border-[#383b40] text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#0a66c2] dark:text-[#70b5f9]" />
                  Jobs across Bengaluru, Mumbai, Delhi NCR & Hyderabad
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link to="/network" className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1d2226] hover:bg-blue-50 dark:hover:bg-[#2a3036] border border-slate-200 dark:border-[#383b40] text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0a66c2] dark:text-[#70b5f9]" />
                  Alumni network (IITs, BITS, NITs, IIITs)
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link to="/login" className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1d2226] hover:bg-blue-50 dark:hover:bg-[#2a3036] border border-slate-200 dark:border-[#383b40] text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0a66c2] dark:text-[#70b5f9]" />
                  FinTech, UPI & Indian SaaS discussions
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e0dfdc] dark:border-[#383b40] bg-[#f4f2ee] dark:bg-[#1d2226] py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
          <span className="font-bold text-slate-800 dark:text-white">
            <span className="text-[#0a66c2] dark:text-[#70b5f9]">Linked</span>
            <span className="bg-[#0a66c2] text-white px-1 py-0.5 rounded-[2px] text-[10px]">in</span>
            <span className="font-normal text-slate-500 dark:text-slate-400 ml-1">© 2025</span>
          </span>
          <Link to="/about" className="hover:underline">About</Link>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Privacy & Terms</a>
          <a href="#" className="hover:underline">Community Guidelines</a>
        </div>
      </footer>
    </div>
  );
};
