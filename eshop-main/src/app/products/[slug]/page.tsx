import { notFound } from 'next/navigation';
import { getClient } from '@/lib/apollo-client';
import {
  GetProductDocument,
  type GetProductQuery,
  type GetProductQueryVariables,
} from '@/graphql/__generated__/graphql';
import { AddToCartButton } from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="600" height="450" fill="#e5e7eb"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">No image</text></svg>`
  );

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: GetProductQuery['productBySlug'] | null = null;

  try {
    const client = getClient();
    const { data } = await client.query<GetProductQuery, GetProductQueryVariables>({
      query: GetProductDocument,
      variables: { slug: params.slug },
    });
    product = data?.productBySlug ?? null;
  } catch {
    product = null;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.thumbnailUrl || PLACEHOLDER}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">SKU: {product.sku}</p>
          <p className="mt-4 text-3xl font-bold text-neutral-900">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="mt-6 text-neutral-700">{product.description}</p>

          <p className="mt-4 text-sm">
            <span className="text-green-700">In stock</span>
          </p>

          <div className="mt-8">
            <AddToCartButton productId={product.id} maxQuantity={99} />
          </div>
        </div>
      </div>
    </div>
  );
}
