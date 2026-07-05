import Link from 'next/link';
import { getClient } from '@/lib/apollo-client';
import {
  GetProductsDocument,
  type GetProductsQuery,
} from '@/graphql/__generated__/graphql';
import { ProductCard } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

async function fetchProducts() {
  try {
    const client = getClient();
    const { data } = await client.query<GetProductsQuery>({
      query: GetProductsDocument,
      variables: { first: 12 },
    });
    return data?.products?.edges.map((e) => e.node) ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div>
      <section className="border-b border-neutral-200 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Shop the latest, delivered fast.
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              Browse our catalog of quality products, manage your cart, and check out
              securely with your Eshop account.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Browse products
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Featured products</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
            <p className="text-neutral-500">
              No products available. Make sure your Eshop GraphQL backend is running
              at <code className="font-mono text-sm">http://localhost:4000/graphql</code>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
