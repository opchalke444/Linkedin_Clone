import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/feed');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Stay updated on your professional world
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-[#383b40] bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#0a66c2] dark:focus:border-[#70b5f9] focus:ring-1 focus:ring-[#0a66c2] dark:focus:ring-[#70b5f9] outline-none transition-colors"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-[#383b40] bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#0a66c2] dark:focus:border-[#70b5f9] focus:ring-1 focus:ring-[#0a66c2] dark:focus:ring-[#70b5f9] outline-none pr-10 transition-colors"
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

        <div className="flex justify-between items-center text-xs">
          <a href="#" className="font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
        New to LinkedIn?{' '}
        <Link to="/register" className="font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline">
          Join now
        </Link>
      </div>
    </div>
  );
};
