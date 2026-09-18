export interface JwtPayload {
  userId: number | string;
  role: string;
  iat?: number;
  exp: number;
  [key: string]: unknown;
}

export interface SessionPayload {
  accessToken: string;
  userId: number | string;
  role: string;
  exp: number;
}

export const AUTH_COOKIE_NAME = 'admin_access_token';
export const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24;

export function getSessionSecret(): string | null {
  return process.env.AUTH_SESSION_SECRET || null;
}

function base64UrlDecode(value: string): string {
  let base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }

  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeJson(value: unknown): string {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(value)));
}

async function importHmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signHmac(data: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}

async function verifyHmac(data: string, signature: string, secret: string): Promise<boolean> {
  try {
    const key = await importHmacKey(secret);
    const normalizedSignature = signature.replace(/-/g, '+').replace(/_/g, '/');
    const signatureBytes = Uint8Array.from(atob(normalizedSignature), (character) =>
      character.charCodeAt(0)
    );

    return crypto.subtle.verify('HMAC', key, signatureBytes, new TextEncoder().encode(data));
  } catch {
    return false;
  }
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as Partial<JwtPayload>;
    const hasUserId = typeof payload.userId === 'number' || typeof payload.userId === 'string';

    if (!hasUserId || typeof payload.role !== 'string' || typeof payload.exp !== 'number') {
      return null;
    }

    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(
  payload: Pick<JwtPayload, 'exp'>,
  nowSeconds = Math.floor(Date.now() / 1000)
): boolean {
  return typeof payload.exp !== 'number' || payload.exp <= nowSeconds;
}

export async function createSignedSessionToken(
  payload: SessionPayload,
  secret: string
): Promise<string> {
  const encodedPayload = encodeJson(payload);
  const signature = await signHmac(encodedPayload, secret);
  return encodedPayload + '.' + signature;
}

export async function verifySignedSessionToken(
  signedToken: string | null | undefined,
  secret: string
): Promise<SessionPayload | null> {
  if (!signedToken || !secret) {
    return null;
  }

  const parts = signedToken.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, signature] = parts;
  if (!(await verifyHmac(encodedPayload, signature, secret))) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as Partial<SessionPayload>;
    const hasUserId = typeof payload.userId === 'number' || typeof payload.userId === 'string';

    if (
      typeof payload.accessToken !== 'string' ||
      !hasUserId ||
      typeof payload.role !== 'string' ||
      typeof payload.exp !== 'number'
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function isValidAdminSessionToken(
  signedToken: string | null | undefined,
  secret: string
): Promise<boolean> {
  const session = await verifySignedSessionToken(signedToken, secret);
  return Boolean(session && session.role === 'admin' && !isJwtExpired(session));
}
