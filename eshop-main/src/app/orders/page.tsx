'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client/react';
import {
  GetOrdersDocument,
  type GetOrdersQuery,
} from '@/graphql/__generated__/graphql';

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { data, loading, error } = useQuery<GetOrdersQuery>(GetOrdersDocument);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-neutral-500">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-red-600">Could not load your orders. Please try again later.</p>
      </div>
    );
  }

  const orders = data?.orders?.edges.map((e) => e.node) ?? [];

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-neutral-900">Your orders</h1>
        <p className="mt-2 text-neutral-600">You haven&apos;t placed any orders yet.</p>
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
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Your orders</h1>

      <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-neutral-700">Order #</th>
              <th className="px-4 py-3 font-semibold text-neutral-700">Status</th>
              <th className="px-4 py-3 font-semibold text-neutral-700">Date</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-700">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColor[order.status] || 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                  ${Number(order.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
