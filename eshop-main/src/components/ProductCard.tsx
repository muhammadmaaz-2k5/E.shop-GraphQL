'use client';

import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AddToCartDocument,
  type AddToCartMutation,
} from '@/graphql/__generated__/graphql';
import { getAccessToken } from '@/lib/auth';
import type { Product } from '@/graphql/__generated__/graphql';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#e5e7eb"/><text x="50%" y="50%" font-family="sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">No image</text></svg>`
  );

export function ProductCard({ product }: { product: Product }) {
  const [addToCart] = useMutation<AddToCartMutation>(AddToCartDocument);
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!getAccessToken()) {
      router.push('/login?redirect=/products');
      return;
    }
    setAdding(true);
    setError(null);
    try {
      await addToCart({ variables: { productId: product.id, quantity: 1 } });
      router.push('/cart');
    } catch {
      setError('Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnailUrl || PLACEHOLDER}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold text-neutral-900">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-neutral-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </Link>
  );
}
