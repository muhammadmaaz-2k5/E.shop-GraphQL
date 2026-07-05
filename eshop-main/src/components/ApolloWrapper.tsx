'use client';

import { HttpLink, split } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import {
  ApolloClient as NextSSRApolloClient,
  InMemoryCache as NextSSRInMemoryCache,
  ApolloNextAppProvider,
} from '@apollo/client-integration-nextjs';
import { createClient } from 'graphql-ws';
import { getCookie } from 'cookies-next';

const HTTP_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
const WS_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/graphql';

function makeClient() {
  const httpLink = new HttpLink({
    uri: HTTP_ENDPOINT,
    fetch: async (uri: RequestInfo | URL, options?: RequestInit) => {
      const token = getCookie('accessToken');
      const headers: Record<string, string> = {
        ...(options?.headers as Record<string, string>),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      return fetch(uri, { ...options, headers });
    },
  });

  const wsLink =
    typeof window !== 'undefined'
      ? new GraphQLWsLink(
          createClient({
            url: WS_ENDPOINT,
            connectionParams: async () => {
              const token = getCookie('accessToken');
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
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
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
