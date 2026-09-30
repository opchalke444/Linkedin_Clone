import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, MapPin, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password requirements
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMsg('Please satisfy all password complexity requirements.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        headline: headline.trim() || undefined,
        location: location.trim() || undefined,
      });
      navigate('/feed');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
          Make the most of your professional life
        </h1>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="e.g. Jordan Reed"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (8+ chars, 1 uppercase, 1 number)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none pr-14"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-7 text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Password strength checklist */}
        {password.length > 0 && (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1d2226] border border-slate-200 dark:border-[#383b40] text-[11px] space-y-1">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
              {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
              {hasUppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>At least one uppercase letter (A-Z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
              {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>At least one number (0-9)</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Headline (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Full-Stack Developer | React & Node.js"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Bengaluru, Karnataka"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none"
          />
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pt-1">
          By clicking Agree & Join, you agree to the LinkedIn <a href="#" className="text-[#0a66c2] dark:text-[#70b5f9] font-semibold hover:underline">User Agreement</a>, <a href="#" className="text-[#0a66c2] dark:text-[#70b5f9] font-semibold hover:underline">Privacy Policy</a>, and <a href="#" className="text-[#0a66c2] dark:text-[#70b5f9] font-semibold hover:underline">Cookie Policy</a>.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Agree & Join'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
        Already on LinkedIn?{' '}
        <Link to="/login" className="font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};
