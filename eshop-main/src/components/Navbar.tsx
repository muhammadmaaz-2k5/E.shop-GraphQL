'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
  { href: '/orders', label: 'Orders' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-white">
          <span className="text-gradient-primary">E</span>shop
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors duration-200 hover:text-indigo-400 ${
                pathname === link.href ? 'text-indigo-400' : 'text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {loading ? (
            <span className="text-sm text-slate-500 animate-pulse">Loading…</span>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-400">
                Hi, {user?.firstName || user?.email}
              </span>
              <button
                onClick={logout}
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="glow-button rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-bold text-white transition-all hover:from-indigo-500 hover:to-violet-500"
            >
              Sign in
            </Link>
          )}
        </div>

        <button
          className="flex items-center text-slate-300 md:hidden hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/5 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm font-semibold transition-colors ${
                  pathname === link.href ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-white/5 pt-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Hi, {user?.firstName || user?.email}</p>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-bold text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
