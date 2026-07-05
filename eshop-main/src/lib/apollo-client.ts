import { HttpLink } from '@apollo/client/core';
import { registerApolloClient } from '@apollo/client-integration-nextjs';
import {
  ApolloClient as NextSSRApolloClient,
  InMemoryCache as NextSSRInMemoryCache,
} from '@apollo/client-integration-nextjs';
import { cookies } from 'next/headers';

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      fetch: async (uri: RequestInfo | URL, options?: RequestInit) => {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        const headers: Record<string, string> = {
          ...(options?.headers as Record<string, string>),
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
