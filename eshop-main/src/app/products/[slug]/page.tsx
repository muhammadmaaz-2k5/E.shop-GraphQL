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
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="600" height="450" fill="#1e293b"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#64748b" text-anchor="middle" dominant-baseline="middle">No image</text></svg>`
  );

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: GetProductQuery['productBySlug'] | null = null;

  try {
    const client = getClient();
    const { data } = await client.query<GetProductQuery, GetProductQueryVariables>({
      query: GetProductDocument,
      variables: { slug },
    });
    product = data?.productBySlug ?? null;
  } catch {
    product = null;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute top-[20%] -left-40 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-2xl glass-panel bg-slate-950/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnailUrl || PLACEHOLDER}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-slate-400 font-medium">SKU: {product.sku}</p>
            <p className="mt-4 text-3xl font-black text-white">
              ${Number(product.price).toFixed(2)}
            </p>
            <p className="mt-6 text-base text-slate-300 leading-relaxed max-w-xl">
              {product.description}
            </p>

            <p className="mt-5 text-sm">
              <span className="text-green-400 font-bold">✓ In stock</span>
            </p>

            <div className="mt-8">
              <AddToCartButton productId={product.id} maxQuantity={99} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
