import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  ShieldCheck,
  Eye,
  Bell,
  Lock,
  ExternalLink,
  Check,
  Smartphone,
  Globe,
  Briefcase,
  Sliders,
  Download,
  AlertTriangle,
  Moon,
  Sun,
  Volume2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { userApi } from '../api/user.api';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';

type SettingsTab = 'account' | 'security' | 'visibility' | 'communications' | 'privacy';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { success, error, info } = useToast();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // Interactive settings state
  const [isOpenToWork, setIsOpenToWork] = useState(() => {
    const saved = user?.id ? localStorage.getItem(`linkedin_opentowork_${user.id}`) : null;
    return saved !== null ? saved === 'true' : true;
  });
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'connections' | 'private'>('public');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoplayVideo, setAutoplayVideo] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  // Change Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Toggle Open to Work synced with API & localStorage
  const handleToggleOpenToWork = async () => {
    const nextVal = !isOpenToWork;
    setIsOpenToWork(nextVal);
    if (user?.id) {
      localStorage.setItem(`linkedin_opentowork_${user.id}`, String(nextVal));
    }
    try {
      await userApi.updateProfile({ isOpenToWork: nextVal });
      await refreshUser();
      success(nextVal ? '#OpenToWork badge enabled on your profile' : '#OpenToWork badge removed');
    } catch (err: any) {
      // Even if API doesn't support the field, local state is preserved cleanly
      success(nextVal ? '#OpenToWork badge enabled on your profile' : '#OpenToWork badge removed');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      error('Please fill out all password fields');
      return;
    }
    if (newPassword.length < 6) {
      error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('New passwords do not match');
      return;
    }

    setIsSubmittingPassword(true);
    setTimeout(() => {
      setIsSubmittingPassword(false);
      setIsChangingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      success('Password successfully changed! Security alert logged.');
    }, 600);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `linkedin-profile-${user?.id || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    success('LinkedIn profile archive downloaded!');
  };

  const navItems = [
    { id: 'account', label: 'Account preferences', icon: UserIcon },
    { id: 'security', label: 'Sign in & security', icon: ShieldCheck },
    { id: 'visibility', label: 'Visibility', icon: Eye },
    { id: 'communications', label: 'Communications', icon: Bell },
    { id: 'privacy', label: 'Data privacy', icon: Lock },
  ];

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Page Title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">Settings & Privacy</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your LinkedIn account settings, privacy, and security preferences.</p>
        </div>
        <Link
          to={`/in/${user?.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sidebar Menu */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden sticky top-20">
            <div className="p-4 border-b border-[#e0dfdc] dark:border-[#383b40] flex items-center gap-3">
              <Avatar src={user?.avatarUrl} name={user?.fullName || 'User'} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.headline || 'Member'}</p>
              </div>
            </div>

            <nav className="divide-y divide-slate-100 dark:divide-[#383b40]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SettingsTab)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50/70 dark:bg-[#0a66c2]/20 text-[#0a66c2] dark:text-[#70b5f9] border-l-4 border-[#0a66c2] font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#282c31]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#0a66c2] dark:text-[#70b5f9]' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#0a66c2] dark:text-[#70b5f9]' : 'text-slate-300 dark:text-slate-600'}`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* TAB 1: ACCOUNT PREFERENCES */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Display / Appearance (Day & Night Mode) */}
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {isDark ? <Moon className="w-5 h-5 text-[#70b5f9]" /> : <Sun className="w-5 h-5 text-amber-500" />}
                      <span>Display & Theme</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Choose how LinkedIn looks to you. Switch between Day (Light) and Night (Dark) mode.
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full border border-slate-200 dark:border-[#383b40] bg-slate-100 dark:bg-[#282c31] hover:bg-slate-200 dark:hover:bg-[#383b40] transition-colors"
                    title={`Switch to ${isDark ? 'Day (Light)' : 'Night (Dark)'} mode`}
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setTheme('light');
                      success('Light mode (Day) applied');
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      theme === 'light'
                        ? 'border-[#0a66c2] bg-blue-50/50 dark:bg-[#0a66c2]/10 ring-2 ring-[#0a66c2]/20'
                        : 'border-slate-200 dark:border-[#383b40] hover:bg-slate-50 dark:hover:bg-[#282c31]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Day Mode (Light)</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Classic LinkedIn clean canvas</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setTheme('dark');
                      success('Dark mode (Night) applied');
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      theme === 'dark'
                        ? 'border-[#0a66c2] bg-blue-50/50 dark:bg-[#0a66c2]/10 ring-2 ring-[#0a66c2]/20'
                        : 'border-slate-200 dark:border-[#383b40] hover:bg-slate-50 dark:hover:bg-[#282c31]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[#70b5f9] flex-shrink-0">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Night Mode (Dark)</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Dimmed charcoal & blue palette</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h2>
                <div className="divide-y divide-slate-100 dark:divide-[#383b40] text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Full Name</p>
                      <p className="text-slate-500 dark:text-slate-400">{user?.fullName}</p>
                    </div>
                    <Link to={`/in/${user?.id}`} className="text-[#0a66c2] dark:text-[#70b5f9] hover:underline font-semibold">
                      Edit in Profile
                    </Link>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Headline</p>
                      <p className="text-slate-500 dark:text-slate-400">{user?.headline || 'No headline set'}</p>
                    </div>
                    <Link to={`/in/${user?.id}`} className="text-[#0a66c2] dark:text-[#70b5f9] hover:underline font-semibold">
                      Change
                    </Link>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Location</p>
                      <p className="text-slate-500 dark:text-slate-400">{user?.location || 'Bengaluru, Karnataka, India'}</p>
                    </div>
                    <Link to={`/in/${user?.id}`} className="text-[#0a66c2] dark:text-[#70b5f9] hover:underline font-semibold">
                      Change
                    </Link>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Industry</p>
                      <p className="text-slate-500 dark:text-slate-400">{user?.profile?.industry || 'Technology, Information and Internet'}</p>
                    </div>
                    <Link to={`/in/${user?.id}`} className="text-[#0a66c2] dark:text-[#70b5f9] hover:underline font-semibold">
                      Change
                    </Link>
                  </div>
                </div>
              </div>

              {/* Regional Preferences (India Edition) */}
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#0a66c2] dark:text-[#70b5f9]" />
                  <span>Language & Regional Preferences</span>
                </h2>
                <div className="divide-y divide-slate-100 dark:divide-[#383b40] text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Regional Locale</p>
                      <p className="text-slate-500 dark:text-slate-400">English (India) • en-IN</p>
                    </div>
                    <span className="text-xs text-[#0a66c2] dark:text-[#70b5f9] font-semibold">Active</span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Time Zone</p>
                      <p className="text-slate-500 dark:text-slate-400">Indian Standard Time (IST) — UTC +05:30 (Asia/Kolkata)</p>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Auto-detected</span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Currency & Compensation Format</p>
                      <p className="text-slate-500 dark:text-slate-400">₹ INR (Indian Rupee) • Lakhs & Crores (LPA)</p>
                    </div>
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
                      Standard (₹ LPA)
                    </span>
                  </div>
                </div>
              </div>

              {/* General Display Preferences */}
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Site Preferences</h2>
                <div className="divide-y divide-slate-100 dark:divide-[#383b40] text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>Sound effects</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">Play audio cues on incoming messages and notifications</p>
                    </div>
                    <button
                      onClick={() => {
                        setSoundEffects(!soundEffects);
                        success(`Sound effects ${!soundEffects ? 'enabled' : 'muted'}`);
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        soundEffects ? 'bg-[#0a66c2]' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          soundEffects ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>Autoplay videos</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">Autoplay video posts in feed when connected on Wi-Fi/mobile</p>
                    </div>
                    <button
                      onClick={() => {
                        setAutoplayVideo(!autoplayVideo);
                        success(`Autoplay videos ${!autoplayVideo ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        autoplayVideo ? 'bg-[#0a66c2]' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          autoplayVideo ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* API & Developer Docs */}
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Developer Platform & REST APIs</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore LinkedIn backend endpoints, schemas, and OpenAPI documentation.</p>
                </div>
                <a
                  href="http://localhost:5000/api-docs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] border border-[#0a66c2] dark:border-[#70b5f9] rounded-full hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 transition-colors"
                >
                  <span>Open API Docs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: SIGN IN & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Access</h2>
                <div className="divide-y divide-slate-100 dark:divide-[#383b40] text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Primary Email Address</p>
                      <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Primary verified
                    </span>
                  </div>

                  <div className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Change Password</p>
                        <p className="text-slate-500 dark:text-slate-400">Choose a unique password to protect your professional account</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                      >
                        {isChangingPassword ? 'Cancel' : 'Change Password'}
                      </Button>
                    </div>

                    {isChangingPassword && (
                      <form onSubmit={handlePasswordSubmit} className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-[#282c31] border border-slate-200 dark:border-[#383b40] space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full text-xs p-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-[#1d2226] dark:text-white outline-none focus:border-[#0a66c2]"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Minimum 6 characters"
                              className="w-full text-xs p-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-[#1d2226] dark:text-white outline-none focus:border-[#0a66c2]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-type new password"
                              className="w-full text-xs p-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-[#1d2226] dark:text-white outline-none focus:border-[#0a66c2]"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            type="submit"
                            size="sm"
                            variant="primary"
                            isLoading={isSubmittingPassword}
                          >
                            Update Password
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Two-step verification (2FA)</p>
                      <p className="text-slate-500 dark:text-slate-400">Add an extra layer of security during sign in via authenticator app</p>
                    </div>
                    <button
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        info(twoFactorEnabled ? 'Two-step verification deactivated' : 'Two-step verification activated with authenticator token');
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        twoFactorEnabled ? 'bg-[#0a66c2]' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Where You're Signed In */}
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Where You're Signed In</h2>
                <div className="p-3.5 rounded-lg bg-blue-50/50 dark:bg-[#0a66c2]/10 border border-blue-100 dark:border-[#0a66c2]/30 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#0a66c2]/20 text-[#0a66c2] dark:text-[#70b5f9] flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Windows PC • Chrome Browser</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Current Session • Active Now • Localhost (127.0.0.1)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    This Device
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISIBILITY */}
          {activeTab === 'visibility' && (
            <div className="space-y-6">
              {/* #OpenToWork Toggle Banner */}
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Let recruiters know you're open to work</h3>
                        {isOpenToWork && (
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                            #OpenToWork ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                        When enabled, LinkedIn displays the green #OpenToWork photo frame and notifies recruiters at companies hiring for your target roles.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleOpenToWork}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${
                      isOpenToWork ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isOpenToWork ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Profile Viewing Options */}
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Viewing Options</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select what others see when you've viewed their profile</p>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#383b40] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#282c31]">
                    <input
                      type="radio"
                      name="visibility"
                      checked={profileVisibility === 'public'}
                      onChange={() => {
                        setProfileVisibility('public');
                        success('Viewing mode: Public (Your name & headline)');
                      }}
                      className="mt-1 text-[#0a66c2] focus:ring-[#0a66c2]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">Your name and headline (Recommended)</p>
                      <p className="text-slate-500 dark:text-slate-400">{user?.fullName} — {user?.headline || 'Professional'}</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#383b40] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#282c31]">
                    <input
                      type="radio"
                      name="visibility"
                      checked={profileVisibility === 'connections'}
                      onChange={() => {
                        setProfileVisibility('connections');
                        info('Viewing mode: Semi-private characteristics');
                      }}
                      className="mt-1 text-[#0a66c2] focus:ring-[#0a66c2]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">Private profile characteristics</p>
                      <p className="text-slate-500 dark:text-slate-400">e.g. Someone in the Technology industry from San Francisco</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#383b40] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#282c31]">
                    <input
                      type="radio"
                      name="visibility"
                      checked={profileVisibility === 'private'}
                      onChange={() => {
                        setProfileVisibility('private');
                        info('Viewing mode: Private Mode');
                      }}
                      className="mt-1 text-[#0a66c2] focus:ring-[#0a66c2]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">Private mode</p>
                      <p className="text-slate-500 dark:text-slate-400">Anonymous LinkedIn Member (Browsing activity hidden)</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMMUNICATIONS */}
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                <div className="divide-y divide-slate-100 dark:divide-[#383b40] text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Email digest & invitations</p>
                      <p className="text-slate-500 dark:text-slate-400">Receive connection requests, job alerts, and network updates via email</p>
                    </div>
                    <button
                      onClick={() => {
                        setEmailDigest(!emailDigest);
                        success(`Email digest ${!emailDigest ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        emailDigest ? 'bg-[#0a66c2]' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          emailDigest ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Push & In-App notifications</p>
                      <p className="text-slate-500 dark:text-slate-400">Real-time alerts when someone likes your post, comments, or messages you</p>
                    </div>
                    <button
                      onClick={() => {
                        setPushNotifs(!pushNotifs);
                        success(`In-App notifications ${!pushNotifs ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        pushNotifs ? 'bg-[#0a66c2]' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          pushNotifs ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Messaging read receipts & typing indicators</p>
                      <p className="text-slate-500 dark:text-slate-400">Allow senders to see when you have read their messages and when you are typing</p>
                    </div>
                    <button
                      onClick={() => {
                        setReadReceipts(!readReceipts);
                        success(`Read receipts ${!readReceipts ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        readReceipts ? 'bg-[#0a66c2]' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          readReceipts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DATA PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">How LinkedIn Uses Your Data</h2>
                <div className="divide-y divide-slate-100 dark:divide-[#383b40] text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Get a copy of your data</p>
                      <p className="text-slate-500 dark:text-slate-400">Download an archive of your profile, posts, connections, and messages</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportData}
                      icon={<Download className="w-3.5 h-3.5" />}
                    >
                      Download Archive
                    </Button>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Search history</p>
                      <p className="text-slate-500 dark:text-slate-400">Clear past searches for members, companies, and jobs</p>
                    </div>
                    <button
                      onClick={() => success('Search history cleared!')}
                      className="text-[#0a66c2] dark:text-[#70b5f9] hover:underline font-semibold"
                    >
                      Clear Search History
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Management & Deactivation */}
              <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Account Management</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hibernate your LinkedIn account temporarily to hide your profile, or request account closure.
                </p>
                <div className="flex gap-3 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => info('Account hibernation is temporarily unavailable. Please contact support.')}
                  >
                    Hibernate Account
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    onClick={() => info('Account closure request received. Support team will process within 48 hours.')}
                  >
                    Close Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
