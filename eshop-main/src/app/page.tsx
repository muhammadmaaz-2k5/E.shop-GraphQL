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
      variables: { first: 8 },
    });
    return data?.products?.edges.map((e) => e.node) ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await fetchProducts();

  const categories = [
    { name: 'Electronics', count: '120+ Products', icon: '💻', gradient: 'from-violet-600/20 to-indigo-600/20' },
    { name: 'Fashion & Style', count: '85+ Products', icon: '👕', gradient: 'from-cyan-600/20 to-teal-600/20' },
    { name: 'Sports & Active', count: '45+ Products', icon: '👟', gradient: 'from-fuchsia-600/20 to-pink-600/20' },
    { name: 'Home Living', count: '60+ Products', icon: '🏠', gradient: 'from-amber-600/20 to-orange-600/20' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Floating Decorative Blur Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-[40%] -right-40 h-[450px] w-[450px] rounded-full bg-cyan-600/10 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-[20%] h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden border-b border-white/5 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-left">
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20">
              Welcome to the Eshop Platform
            </span>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
              Revolutionize Your <br />
              <span className="text-gradient font-black">Shopping Experience.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
              Explore our premium curated catalog of modern products, enjoy instant real-time cart updating, and check out in a single tap.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="glow-button rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                Browse catalog
              </Link>
              <Link
                href="/login"
                className="glass-panel rounded-xl px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/5 hover:border-white/20"
              >
                Sign in to account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white">Browse Categories</h2>
          <p className="text-sm text-slate-400 mt-1">Discover products customized to your exact lifestyle</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group glass-panel glass-panel-hover p-6 rounded-2xl flex items-center gap-4 cursor-pointer"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} text-2xl`}>
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mb-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">Featured Catalog</h2>
            <p className="text-sm text-slate-400 mt-1">Handpicked premium products on sale this week</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-indigo-400 transition-colors duration-300 hover:text-cyan-400"
          >
            Explore all catalog →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center border-dashed border-white/10">
            <span className="text-4xl">⚠️</span>
            <h3 className="mt-4 font-bold text-white">Catalog is empty</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
              No products were found. Verify that the Eshop GraphQL server is active and seeded at <code className="font-mono bg-white/5 px-2 py-0.5 rounded text-indigo-400 text-xs">http://localhost:4000/graphql</code>.
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
