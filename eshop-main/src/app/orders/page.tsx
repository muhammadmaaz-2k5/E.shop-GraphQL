'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client/react';
import {
  GetOrdersDocument,
  type GetOrdersQuery,
} from '@/graphql/__generated__/graphql';

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  PROCESSING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  SHIPPED: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  DELIVERED: 'bg-green-500/10 text-green-400 border border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function OrdersPage() {
  const { data, loading, error } = useQuery<GetOrdersQuery>(GetOrdersDocument);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-slate-400 animate-pulse">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-red-400">Could not load your orders. Please try again later.</p>
      </div>
    );
  }

  const orders = data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white">Your orders</h1>
        <p className="mt-2 text-sm text-slate-400">You haven&apos;t placed any orders yet.</p>
        <Link
          href="/products"
          className="glow-button mt-6 inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white transition-all"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-tight text-white">Your orders</h1>

      <div className="mt-8 overflow-hidden rounded-2xl glass-panel">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-white/5 bg-slate-900/30 text-slate-300 font-bold text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4 font-bold">Order #</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Date</th>
              <th className="px-5 py-4 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors duration-300">
                <td className="px-5 py-4 font-bold text-white font-mono text-sm">
                  {order.orderNumber}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      statusColor[order.status] || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {new Date(order.createdAt as string).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right font-black text-white text-base">
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
