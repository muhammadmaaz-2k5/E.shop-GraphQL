# Next.js Frontend Integration Guide for Eshop GraphQL API

This guide provides a complete, production-ready blueprint for integrating a **Next.js 14+ (App Router)** frontend with your running **Eshop GraphQL API**. 

---

## 1. Project Initialization & Setup

From the sibling directory of your backend, run the following commands to initialize the frontend repository and install dependencies:

```bash
# 1. Create a new Next.js app in the sibling directory
npx create-next-app@latest frontend --typescript --tailwind --eslint --use-npm --src-dir --app

# 2. Change directory into the frontend
cd frontend

# 3. Install GraphQL & Apollo Client dependencies
npm install @apollo/client @apollo/experimental-nextjs-app-support graphql graphql-ws

# 4. Install GraphQL Code Generator for type-safety
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset @parcel/watcher
```

---

## 2. Directory Structure

Ensure your `src/` folder has the following directory structure:

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── cart/
│       └── page.tsx
├── components/
│   ├── ApolloWrapper.tsx       # Providers wrapper for client-side Apollo
│   └── Navbar.tsx
├── graphql/
│   ├── queries.graphql         # Storefront queries
│   ├── mutations.graphql       # Auth, Cart, and Order mutations
│   └── __generated__/          # Auto-generated Typescript hooks and definitions
├── lib/
│   ├── apollo-client.ts        # Server-side Apollo client
│   └── auth.ts                 # Access token and token rotation helpers
└── middleware.ts               # Next.js middleware for route protection
```

---

## 3. GraphQL Code Generator Setup

Create a file named `codegen.ts` in the root of your `frontend` directory:

```typescript
// codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql", // Target running backend
  documents: "src/graphql/**/*.graphql",   // Location of operation files
  generates: {
    "src/graphql/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  }
};

export default config;
```

Add these generation scripts to your `package.json`:
```json
"scripts": {
  "codegen": "graphql-codegen --config codegen.ts",
  "codegen:watch": "graphql-codegen --config codegen.ts --watch"
}
```

---

## 4. Setting up Apollo Client for Server & Client Components

Next.js App Router splits execution into Server and Client Components. You need separate clients for both:

### A. Server Components Client (RSC)
Create `src/lib/apollo-client.ts` to perform static or dynamic server-side data fetching:

```typescript
// src/lib/apollo-client.ts
import { HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { NextSSRApolloClient, NextSSRInMemoryCache } from "@apollo/experimental-nextjs-app-support/ssr";
import { cookies } from "next/headers";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      fetch: async (uri, options) => {
        const cookieStore = cookies();
        const token = cookieStore.get("accessToken")?.value;
        
        // Attach authorization header on server-side requests
        const headers = {
          ...options?.headers as Record<string, string>,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        
        return fetch(uri, {
          ...options,
          headers,
        });
      },
    }),
  });
});
```

### B. Client Components Client Wrapper (ApolloWrapper)
Create `src/components/ApolloWrapper.tsx` to wrap your root layout:

```typescript
// src/components/ApolloWrapper.tsx
"use client";

import { HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { NextSSRApolloClient, NextSSRInMemoryCache, ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support/ssr";
import { createClient } from "graphql-ws";
import { getCookie } from "cookies-next"; // Install using: npm install cookies-next

const HTTP_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";
const WS_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT || "ws://localhost:4000/graphql";

function makeClient() {
  const httpLink = new HttpLink({
    uri: HTTP_ENDPOINT,
    fetch: async (uri, options) => {
      const token = getCookie("accessToken");
      const headers = {
        ...options?.headers as Record<string, string>,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      return fetch(uri, { ...options, headers });
    },
  });

  // Websocket connection link for GraphQL Subscriptions
  const wsLink = typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: WS_ENDPOINT,
          connectionParams: async () => {
            const token = getCookie("accessToken");
            return {
              authorization: token ? `Bearer ${token}` : undefined,
            };
          },
        })
      )
    : null;

  const link = wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link,
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
```

---

## 5. GraphQL Operations Definition

Place these documents under your `src/graphql` directory. Codegen will scan them to produce types.

### A. Queries (`src/graphql/queries.graphql`)
```graphql
query GetProducts($first: Int, $after: String) {
  products(pagination: { first: $first, after: $after }) {
    edges {
      node {
        id
        name
        sku
        price
        slug
        description
        thumbnailUrl
      }
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

query GetMe {
  me {
    id
    email
    role
    firstName
    lastName
  }
}
```

### B. Mutations (`src/graphql/mutations.graphql`)
```graphql
mutation Login($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
    accessToken
    refreshToken
    expiresIn
    user {
      id
      email
      role
    }
  }
}

mutation Register($email: String!, $password: String!, $firstName: String, $lastName: String) {
  register(input: { email: $email, password: $password, firstName: $firstName, lastName: $lastName }) {
    accessToken
    refreshToken
    expiresIn
    user {
      id
      email
      role
    }
  }
}

mutation RefreshToken($token: String!) {
  refreshToken(token: $token) {
    accessToken
    refreshToken
    expiresIn
  }
}

mutation AddToCart($productId: String!, $quantity: Int!) {
  addToCart(input: { productId: $productId, quantity: $quantity }) {
    id
    subtotal
    total
    items {
      id
      productId
      quantity
      unitPrice
      totalPrice
    }
  }
}

mutation CreateOrder($shippingAddress: JSON!) {
  createOrder(input: { shippingAddress: $shippingAddress }) {
    id
    orderNumber
    status
    total
  }
}
```

---

## 6. Authentication & Token Refresh Flow

The Eshop GraphQL backend issues a short-lived `accessToken` and a long-lived `refreshToken`. Here is how you sync them using `cookies-next` on the client.

### Custom Authentication Hook (`src/hooks/useAuth.ts`)
```typescript
// src/hooks/useAuth.ts
import { useMutation, useQuery } from "@apollo/client";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { GetMeDocument, LoginDocument, RegisterDocument } from "@/graphql/__generated__/graphql";

export function useAuth() {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GetMeDocument, {
    skip: !getCookie("accessToken"),
  });

  const [loginMutation] = useMutation(LoginDocument);
  const [registerMutation] = useMutation(RegisterDocument);

  const login = async (email: string, password: string) => {
    const { data: res } = await loginMutation({
      variables: { email, password },
    });

    if (res?.login) {
      const { accessToken, refreshToken, expiresIn } = res.login;
      
      // Store in cookies. Ensure secure flag in production!
      setCookie("accessToken", accessToken, { maxAge: expiresIn });
      setCookie("refreshToken", refreshToken, { maxAge: 7 * 24 * 60 * 60 }); // 7 Days
      
      await refetch();
      router.push("/");
    }
  };

  const logout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    router.push("/login");
  };

  return {
    user: data?.me,
    isAuthenticated: !!data?.me,
    loading,
    login,
    logout,
  };
}
```

---

## 7. Protected Routes Middleware

To prevent unauthenticated users from accessing checkout or orders pages, create `src/middleware.ts` in your frontend directory:

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  // Protect Checkout & Orders directories
  if (!accessToken && !refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};
```

---

## 8. Verifying Connection

Once configuration is complete:
1. Run your backend: `npm run dev` (starts on `http://localhost:4000/graphql`).
2. Generate the types on your frontend: `npm run codegen`.
3. Start the Next.js dev server: `npm run dev` (starts on `http://localhost:3000`).
4. Perform checkouts, auth, and query products securely with full end-to-end type safety!
