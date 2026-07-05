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
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Checkout</h1>
      <p className="mt-2 text-neutral-600">
        Enter your shipping address to place your order.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700">
            Full name
          </label>
          <input
            id="fullName"
            required
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="addressLine1" className="block text-sm font-medium text-neutral-700">
            Address line 1
          </label>
          <input
            id="addressLine1"
            required
            value={form.addressLine1}
            onChange={(e) => update('addressLine1', e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="addressLine2" className="block text-sm font-medium text-neutral-700">
            Address line 2 (optional)
          </label>
          <input
            id="addressLine2"
            value={form.addressLine2}
            onChange={(e) => update('addressLine2', e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-neutral-700">
              City
            </label>
            <input
              id="city"
              required
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-neutral-700">
              State / Province
            </label>
            <input
              id="state"
              required
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700">
              Postal code
            </label>
            <input
              id="postalCode"
              required
              value={form.postalCode}
              onChange={(e) => update('postalCode', e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-neutral-700">
              Country
            </label>
            <input
              id="country"
              required
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
