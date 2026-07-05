'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  GetMeDocument,
  LoginDocument,
  RegisterDocument,
  type GetMeQuery,
  type LoginMutation,
  type RegisterMutation,
  type RegisterMutationVariables,
} from '@/graphql/__generated__/graphql';
import { storeTokens, clearTokens, getAccessToken } from '@/lib/auth';

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, loading, refetch } = useQuery<GetMeQuery>(GetMeDocument, {
    skip: !getAccessToken(),
    errorPolicy: 'ignore',
  });

  const [loginMutation] = useMutation<LoginMutation>(LoginDocument);
  const [registerMutation] = useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument
  );

  const redirectAfterAuth = useCallback(() => {
    const redirect = searchParams.get('redirect');
    router.push(redirect || '/');
    router.refresh();
  }, [router, searchParams]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data: res } = await loginMutation({
        variables: { email, password },
      });

      if (res?.login) {
        const { accessToken, refreshToken, expiresIn } = res.login;
        storeTokens(accessToken, refreshToken, expiresIn);
        await refetch();
        redirectAfterAuth();
      }

      return res?.login ?? null;
    },
    [loginMutation, refetch, redirectAfterAuth]
  );

  const register = useCallback(
    async (input: RegisterMutationVariables) => {
      const { data: res } = await registerMutation({
        variables: input,
      });

      if (res?.register) {
        const { accessToken, refreshToken, expiresIn } = res.register;
        storeTokens(accessToken, refreshToken, expiresIn);
        await refetch();
        redirectAfterAuth();
      }

      return res?.register ?? null;
    },
    [registerMutation, refetch, redirectAfterAuth]
  );

  const logout = useCallback(() => {
    clearTokens();
    router.push('/login');
    router.refresh();
  }, [router]);

  return {
    user: data?.me,
    isAuthenticated: !!data?.me,
    loading,
    login,
    register,
    logout,
  };
}
