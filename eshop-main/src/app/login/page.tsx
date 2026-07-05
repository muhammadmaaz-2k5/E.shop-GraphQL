'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

type Mode = 'login' | 'register';

function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, firstName, lastName });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Authentication failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl glass-panel p-8 shadow-2xl">
      <h1 className="text-3xl font-black tracking-tight text-white">
        {mode === 'login' ? 'Welcome back' : 'Create account'}
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        {mode === 'login'
          ? 'Sign in to your Eshop account to continue.'
          : 'Sign up to start shopping with Eshop.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="glow-button w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white transition-all disabled:opacity-50"
        >
          {submitting
            ? 'Please wait…'
            : mode === 'login'
              ? 'Sign in'
              : 'Create account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute top-[20%] left-[30%] h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Suspense fallback={<div className="rounded-2xl glass-panel p-8 shadow-2xl text-center text-slate-400">Loading…</div>}>
          <AuthForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors font-medium">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
