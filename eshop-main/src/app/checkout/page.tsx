'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import {
  CreateOrderDocument,
  type CreateOrderMutation,
} from '@/graphql/__generated__/graphql';

export default function CheckoutPage() {
  const router = useRouter();
  const [createOrder] = useMutation<CreateOrderMutation>(CreateOrderDocument);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const nameParts = form.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ');

      const { data } = await createOrder({
        variables: {
          shippingAddress: {
            firstName,
            lastName,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
        },
      });
      if (data?.createOrder) {
        router.push('/orders');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not place your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute top-[10%] left-[20%] h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-white">Checkout</h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter your shipping address to place your order.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl glass-panel p-8 shadow-2xl">
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Full name
            </label>
            <input
              id="fullName"
              required
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="addressLine1" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Address line 1
            </label>
            <input
              id="addressLine1"
              required
              value={form.addressLine1}
              onChange={(e) => update('addressLine1', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Address line 2 (optional)
            </label>
            <input
              id="addressLine2"
              value={form.addressLine2}
              onChange={(e) => update('addressLine2', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                City
              </label>
              <input
                id="city"
                required
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                State / Province
              </label>
              <input
                id="state"
                required
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Postal code
              </label>
              <input
                id="postalCode"
                required
                value={form.postalCode}
                onChange={(e) => update('postalCode', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Country
              </label>
              <input
                id="country"
                required
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="glow-button w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-bold text-white transition-all disabled:opacity-50"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </div>
    </div>
  );
}
