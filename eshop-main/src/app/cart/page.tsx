'use client';

import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GetCartDocument,
  RemoveFromCartDocument,
  type GetCartQuery,
  type RemoveFromCartMutation,
} from '@/graphql/__generated__/graphql';
import { getAccessToken } from '@/lib/auth';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#e5e7eb"/></svg>`
  );

export default function CartPage() {
  const { data, loading, error } = useQuery<GetCartQuery>(GetCartDocument, {
    skip: !getAccessToken(),
  });
  const [removeItem] = useMutation<RemoveFromCartMutation>(RemoveFromCartDocument, {
    refetchQueries: [{ query: GetCartDocument }],
  });

  if (!getAccessToken()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-neutral-900">Your cart</h1>
        <p className="mt-2 text-neutral-600">Please sign in to view your cart.</p>
        <Link
          href="/login?redirect=/cart"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-neutral-500">Loading cart…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-red-600">Could not load your cart. Please try again later.</p>
      </div>
    );
  }

  const cart = data?.cart;
  const items = cart?.items ?? [];

  if (!cart || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-neutral-900">Your cart</h1>
        <p className="mt-2 text-neutral-600">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Your cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product?.thumbnailUrl || PLACEHOLDER}
                  alt={item.product?.name ?? 'Product'}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">
                    {item.product?.name ?? 'Product'}
                  </p>
                  <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-neutral-500">
                    ${Number(item.unitPrice).toFixed(2)} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">
                    ${Number(item.totalPrice).toFixed(2)}
                  </p>
                  <button
                    onClick={() => {
                      removeItem({ variables: { itemId: item.id } }).catch(() => {});
                    }}
                    className="mt-1 text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-600">Subtotal</dt>
                <dd className="font-medium text-neutral-900">
                  ${Number(cart.subtotal).toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Total</dt>
                <dd className="text-lg font-bold text-neutral-900">
                  ${Number(cart.total).toFixed(2)}
                </dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-md bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
