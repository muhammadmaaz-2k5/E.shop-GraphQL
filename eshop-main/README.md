# Eshop Storefront

A Next.js 14 (App Router) frontend for the Eshop GraphQL API, featuring Apollo Client, GraphQL Code Generator, JWT auth with cookie-based token rotation, protected routes, and a full storefront UI (products, cart, checkout, orders).

## Getting Started

```bash
# 1. Start your Eshop GraphQL backend on http://localhost:4000/graphql
# 2. Install frontend deps
npm install --legacy-peer-deps

# 3. (Optional) Regenerate types against the live backend
npm run codegen

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** `--legacy-peer-deps` is required because `@apollo/experimental-nextjs-app-support` declares a peer on `next@^15`, but this project uses `next@13.5`. The packages work correctly together.

## Environment

Configure in `.env.local`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | GraphQL HTTP endpoint | `http://localhost:4000/graphql` |
| `NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT` | GraphQL WebSocket endpoint (subscriptions) | `ws://localhost:4000/graphql` |
| `GRAPHQL_SCHEMA_ENDPOINT` | Endpoint used by codegen to introspect the schema | `http://localhost:4000/graphql` |

## Features

- **Apollo Client (RSC + SSR)** — separate server (`src/lib/apollo-client.ts`) and client (`src/components/ApolloWrapper.tsx`) clients, with WebSocket subscriptions support on the client.
- **Type-safe GraphQL** — operations live in `src/graphql/*.graphql`; run `npm run codegen` to regenerate `src/graphql/__generated__/graphql.ts`.
- **Auth** — `src/hooks/useAuth.ts` handles login/register, stores access & refresh tokens in cookies, and exposes the current user.
- **Route protection** — `src/middleware.ts` redirects unauthenticated users from `/checkout` and `/orders` to `/login`.
- **Storefront UI** — home, product listing, product detail, cart, checkout, and orders pages.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Apollo + Navbar + footer)
│   ├── page.tsx                # Home (featured products)
│   ├── login/page.tsx          # Login / register
│   ├── products/
│   │   ├── page.tsx            # Product listing
│   │   └── [slug]/page.tsx     # Product detail
│   ├── cart/page.tsx           # Cart
│   ├── checkout/page.tsx       # Checkout (protected)
│   └── orders/page.tsx         # Orders (protected)
├── components/
│   ├── ApolloWrapper.tsx       # Client Apollo provider
│   ├── Navbar.tsx              # Top navigation with auth state
│   ├── ProductCard.tsx         # Product card
│   └── AddToCartButton.tsx     # Add-to-cart with quantity
├── graphql/
│   ├── queries.graphql         # Storefront queries
│   ├── mutations.graphql       # Auth, Cart, Order mutations
│   └── __generated__/graphql.ts # Typed documents & hooks (codegen)
├── hooks/
│   └── useAuth.ts              # Auth hook
├── lib/
│   ├── apollo-client.ts        # Server-side Apollo client
│   └── auth.ts                 # Token cookie helpers
└── middleware.ts               # Route protection
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run codegen` | Generate GraphQL types once |
| `npm run codegen:watch` | Generate types and watch for changes |
