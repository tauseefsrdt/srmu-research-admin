import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginAdmin } from '../store/thunks/authThunks';
import { selectAuthLoading, selectAuthError } from '../store/selectors';
import { clearAuthError } from '../store/slices/authSlice';
import { AuthResponse } from '../types';

interface AuthModalProps {
  onSuccess?: (user: AuthResponse) => void;
}

export const AuthView: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [localError, setLocalError] = useState('');

  // Login credentials state
  const [email, setEmail] = useState('admin@srmu.ac.in');
  const [password, setPassword] = useState('admin123');

  const error = localError || authError;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearAuthError());
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result) && onSuccess) {
      onSuccess(result.payload);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="admin-ambient-bg">
        <div className="admin-grid-overlay" />
        <div className="admin-orb-primary" />
        <div className="admin-orb-gold" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0A4A8F] to-[#0C5CA8] flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-[#0A4A8F]/20">
            <GraduationCap className="w-8 h-8 text-[#FFB703]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            SRMU Research Console
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Sign in with Administrator Credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@srmu.ac.in"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0A4A8F]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0A4A8F]"
                required
              />
            </div>
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0A4A8F] hover:bg-[#0C5CA8] text-white text-xs font-bold shadow-md shadow-[#0A4A8F]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security notice footer */}
      <div className="text-center mt-6 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-[#0A4A8F]" />
        <span>JWT Bearer Authentication • 256-bit Encrypted Session</span>
      </div>
    </div>
  );
};
