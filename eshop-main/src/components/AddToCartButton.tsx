'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import {
  AddToCartDocument,
  type AddToCartMutation,
} from '@/graphql/__generated__/graphql';
import { getAccessToken } from '@/lib/auth';

export function AddToCartButton({
  productId,
  maxQuantity = 99,
}: {
  productId: string;
  maxQuantity?: number;
}) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addToCart] = useMutation<AddToCartMutation>(AddToCartDocument);
  const router = useRouter();

  const handleAdd = async () => {
    if (!getAccessToken()) {
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }
    setAdding(true);
    setError(null);
    try {
      await addToCart({ variables: { productId, quantity: qty } });
      router.push('/cart');
    } catch {
      setError('Could not add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-medium text-neutral-700">
          Quantity
        </label>
        <select
          id="qty"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAdd}
        disabled={adding}
        className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
      >
        {adding ? 'Adding…' : 'Add to cart'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
