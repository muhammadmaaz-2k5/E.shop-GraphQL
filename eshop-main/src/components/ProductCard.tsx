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
import type { GetProductsQuery } from '@/graphql/__generated__/graphql';

type Product = GetProductsQuery['products']['edges'][number]['node'];

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#1e293b"/><text x="50%" y="50%" font-family="sans-serif" font-size="18" fill="#64748b" text-anchor="middle" dominant-baseline="middle">No image</text></svg>`
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
      className="group glass-panel glass-panel-hover flex flex-col overflow-hidden rounded-2xl transition-all"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnailUrl || PLACEHOLDER}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 cubic-bezier(0.25, 0.8, 0.25, 1) group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-bold text-white transition-colors duration-300 group-hover:text-indigo-400">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight text-white">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="glow-button rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg disabled:opacity-50"
          >
            {adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
        {error && <p className="mt-2 text-[10px] font-semibold text-red-500">{error}</p>}
      </div>
    </Link>
  );
}
