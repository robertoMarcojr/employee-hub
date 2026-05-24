'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, RefreshCw, CheckCircle2, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store/hooks';
import { loginSuccess } from '@/lib/store/authSlice';

export default function LoginView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  const isEmail = identifier.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    setStatus('loading');
    setError('');

    const body = isEmail
      ? { email: identifier, password }
      : { phone: identifier, password };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
        setStatus('idle');
        return;
      }

      const user = await res.json();
      setStatus('success');
      setTimeout(() => {
        dispatch(loginSuccess({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }));
        const target = user.role === 'admin' ? '/admin/users' : user.role === 'executive' ? '/executive' : '/employee';
        router.push(target);
      }, 700);
    } catch {
      setError('Network error');
      setStatus('idle');
    }
  };

  return (
    <div className="bg-editorial-cream text-stone-900 min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-70">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_top_right,rgba(114,47,55,0.03),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_bottom_left,rgba(178,138,82,0.02),transparent_70%)]"></div>
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-stone-200/40"></div>
      </div>

      <div className="w-full max-w-[420px] flex flex-col gap-8 relative z-10 animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-bold font-serif text-stone-900 tracking-tight">Employee Hub</h1>
          <div className="w-16 h-[1px] bg-stone-300 mt-2"></div>
        </div>

        <main className="bg-editorial-paper border border-stone-200 rounded-lg p-6 md:p-8 shadow-[0_4px_24px_rgba(28,25,23,0.03)] relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-editorial-wine via-editorial-gold to-stone-400 rounded-t-lg"></div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-700 uppercase tracking-widest font-sans" htmlFor="identifier">Email or Phone</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  {isEmail || identifier === '' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                <input
                  id="identifier"
                  type={isEmail ? 'email' : 'text'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-md focus:ring-1 focus:ring-editorial-wine focus:border-editorial-wine focus:bg-white transition-all text-xs outline-none text-stone-900 placeholder:text-stone-400"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={status !== 'idle'}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-stone-700 uppercase tracking-widest font-sans" htmlFor="password">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-12 py-2.5 bg-stone-50 border border-stone-200 rounded-md focus:ring-1 focus:ring-editorial-wine focus:border-editorial-wine focus:bg-white transition-all text-xs outline-none text-stone-900 placeholder:text-stone-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status !== 'idle'}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-900 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={status !== 'idle'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-[11px] font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={status !== 'idle'}
              className={`w-full mt-2 font-bold py-3 rounded-md shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 border text-xs tracking-wider uppercase ${
                status === 'loading'
                  ? 'bg-stone-800 text-stone-100 border-stone-950 opacity-90'
                  : status === 'success'
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-editorial-wine text-white hover:bg-stone-900 hover:text-stone-100 hover:border-stone-950 border-editorial-wine transition-colors'
              }`}
            >
              {status === 'loading' && (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Verifying Credentials...</span></>
              )}
              {status === 'success' && (
                <><CheckCircle2 className="w-3.5 h-3.5" /><span>Authorized</span></>
              )}
              {status === 'idle' && (
                <><span>Sign In</span><ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </form>
        </main>
      </div>

      <div className="fixed top-0 right-0 -z-20 w-1/3 h-full opacity-10 pointer-events-none hidden lg:block overflow-hidden border-l border-stone-200/50 bg-stone-100">
        <div className="relative w-full h-full p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-0.5 font-sans">Employee Hub</h4>
            <p className="font-serif italic text-stone-500 text-sm">Issue No. 12 — Global Cluster Migration</p>
          </div>
          <div className="border border-stone-300 p-6 bg-white/70 backdrop-blur-md rounded-md">
            <p className="font-serif text-stone-800 text-sm leading-relaxed">
              &ldquo;Every workspace is an archives-in-waiting. Standardizing enterprise design is not an issue of aesthetic styling alone, but of transactional throughput.&rdquo;
            </p>
            <p className="text-[10px] font-bold text-stone-400 mt-4 uppercase tracking-widest font-sans">— ARCHITECTURE DIGEST</p>
          </div>
          <div>
            <span className="text-[10px] text-stone-450 font-medium">Page 042 / Corp-Net</span>
          </div>
        </div>
      </div>
    </div>
  );
}
