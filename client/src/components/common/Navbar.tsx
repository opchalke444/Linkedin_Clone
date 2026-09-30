import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar } from './Avatar';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useSocket();
  const { theme, isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { label: 'Home', href: '/feed', icon: Home },
    { label: 'My Network', href: '/network', icon: Users },
    { label: 'Jobs', href: '/opportunities', icon: Briefcase },
    { label: 'Messaging', href: '/messages', icon: MessageSquare },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: Bell,
      count: unreadCount,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#1d2226] border-b border-[#e0dfdc] dark:border-[#383b40] shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          {/* Logo & Brand Identity & Global Search */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
            {/* Authentic LinkedIn Logo */}
            <Link to={isAuthenticated ? '/feed' : '/'} className="flex items-center gap-1 flex-shrink-0 group">
              <svg className="w-8 h-8 rounded text-[#0a66c2]" viewBox="0 0 24 24" fill="currentColor">
                <rect width="24" height="24" rx="4" fill="#0A66C2"/>
                <path d="M7.09 19V9.5H3.94V19h3.15zM5.51 8.2c1.09 0 1.77-.73 1.77-1.64-.02-.93-.68-1.64-1.75-1.64s-1.77.71-1.77 1.64c0 .91.68 1.64 1.73 1.64h.02zM19.5 19v-5.44c0-2.91-1.55-4.27-3.62-4.27-1.67 0-2.42.92-2.83 1.57V9.5H9.9c.04.89 0 9.5 0 9.5h3.15v-5.31c0-.28.02-.57.1-.77.23-.57.75-1.16 1.63-1.16 1.15 0 1.61.88 1.61 2.16V19H19.5z" fill="#FFFFFF"/>
              </svg>
            </Link>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md bg-[#edf3f8] dark:bg-[#282c31] border border-transparent focus:border-slate-400 dark:focus:border-slate-500 focus:bg-white dark:focus:bg-[#1d2226] text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 transition-all outline-none"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <nav className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] h-14 border-b-2 transition-colors ${
                      isActive
                        ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
                        : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {item.count !== undefined && item.count > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.5 text-[10px] font-bold bg-[#c00] text-white rounded-full ring-2 ring-white dark:ring-[#1d2226]">
                          {item.count > 99 ? '99+' : item.count}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-normal hidden sm:block mt-0.5">{item.label}</span>
                  </Link>
                );
              })}

              {/* Me Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] h-14 border-b-2 transition-colors ${
                    isProfileDropdownOpen
                      ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                      : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Avatar src={user?.avatarUrl} name={user?.fullName || 'Me'} size="xs" className="w-5 h-5 ring-1 ring-slate-300 dark:ring-slate-600" />
                  <div className="hidden sm:flex items-center gap-0.5 mt-0.5 text-[11px]">
                    <span>Me</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#1d2226] rounded-xl shadow-dropdown border border-[#e0dfdc] dark:border-[#383b40] py-2 z-50 animate-in fade-in-50 zoom-in-95 text-slate-800 dark:text-slate-200">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-[#383b40] flex items-center gap-3">
                      <Avatar src={user?.avatarUrl} name={user?.fullName || ''} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.headline || 'LinkedIn Member'}</p>
                      </div>
                    </div>

                    <div className="p-2 border-b border-slate-100 dark:border-[#383b40]">
                      <Link
                        to={`/profile/${user?.id}`}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block w-full py-1.5 text-center text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] border border-[#0a66c2] dark:border-[#70b5f9] rounded-full hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>

                    <div className="py-1 border-b border-slate-100 dark:border-[#383b40]">
                      <p className="px-4 py-1 text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Account</p>

                      {/* Display / Dark Mode Toggle Option */}
                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#282c31] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          {isDark ? (
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Moon className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>Display: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {isDark ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <Link
                        to="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#282c31] hover:text-[#0a66c2] dark:hover:text-[#70b5f9]"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        Settings & Privacy
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#282c31] hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Day / Night Theme Button (Desktop Top Bar) */}
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode (Day)' : 'Switch to Dark Mode (Night)'}
                className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] h-14 border-b-2 border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group cursor-pointer"
                aria-label="Toggle Day and Night mode"
              >
                <div className="p-1 rounded-full group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                  {isDark ? (
                    <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300 animate-in spin-in-180 duration-300" />
                  )}
                </div>
                <span className="text-[11px] font-normal hidden sm:block mt-0.5">
                  {isDark ? 'Day' : 'Night'}
                </span>
              </button>

              {/* Divider */}
              <div className="hidden lg:block w-px h-8 bg-slate-200 dark:bg-[#383b40] mx-1" />

              {/* Premium / For Business */}
              <div className="hidden xl:flex flex-col items-center justify-center text-center px-2 max-w-[90px]">
                <Link to="/opportunities" className="text-[11px] text-[#915907] dark:text-[#f8c77e] hover:underline leading-tight">
                  Try Premium for ₹0
                </Link>
              </div>
            </nav>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Public Day / Night Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Day and Night mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <Link
                to="/register"
                className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800 px-3 sm:px-4 py-2 rounded-full transition-colors"
              >
                Join now
              </Link>
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-[#0a66c2] dark:text-[#70b5f9] border border-[#0a66c2] dark:border-[#70b5f9] hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
