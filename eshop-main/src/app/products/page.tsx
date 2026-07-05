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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">All products</h1>
      <p className="mt-2 text-neutral-600">
        {products.length > 0
          ? `${products.length} items available`
          : 'No items available right now.'}
      </p>

      {products.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
          <p className="text-neutral-500">
            Could not load products. Ensure the Eshop GraphQL backend is running.
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
  );
}
