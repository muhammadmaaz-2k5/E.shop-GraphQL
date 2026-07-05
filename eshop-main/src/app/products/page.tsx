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
      variables: { first: 24 },
    });
    return data?.products?.edges.map((e) => e.node) ?? [];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="relative min-h-screen">
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-white">All Products</h1>
        <p className="mt-2 text-sm text-slate-400">
          {products.length > 0
            ? `${products.length} items available in our inventory`
            : 'No items available right now.'}
        </p>

        {products.length === 0 ? (
          <div className="mt-8 glass-panel rounded-2xl p-16 text-center border-dashed border-white/10">
            <span className="text-4xl">⚠️</span>
            <h3 className="mt-4 font-bold text-white">No products found</h3>
            <p className="text-slate-400 text-sm mt-1">
              Could not load products. Ensure the Eshop GraphQL backend is active and seeded.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
