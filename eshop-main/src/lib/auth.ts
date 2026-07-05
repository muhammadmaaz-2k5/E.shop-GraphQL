import { setCookie, deleteCookie, getCookie } from 'cookies-next';

export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export function storeTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  setCookie(ACCESS_TOKEN_COOKIE, accessToken, {
    maxAge: expiresIn,
    path: '/',
  });
  setCookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export function clearTokens() {
  deleteCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
  deleteCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
}

export function getAccessToken(): string | undefined {
  return getCookie(ACCESS_TOKEN_COOKIE) as string | undefined;
}

export function getRefreshToken(): string | undefined {
  return getCookie(REFRESH_TOKEN_COOKIE) as string | undefined;
}

export function isAuthenticated(): boolean {
  return !!getAccessToken() || !!getRefreshToken();
}
