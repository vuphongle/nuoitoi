import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  DEFAULT_COOKIE_MAX_AGE,
  createSignedSessionToken,
  decodeJwtPayload,
  getSessionSecret,
  isJwtExpired,
} from '@/lib/auth';

interface BackendLoginResponse {
  status: string;
  statusCode: number;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      password?: string;
    } | null;
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const beBaseUrl = process.env.BE_API_URL || 'http://localhost:3069/api';
    const targetUrl = beBaseUrl.replace(/\/$/, '') + '/auth/login';

    let beResponse: Response;
    try {
      beResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    } catch (networkError) {
      console.error('Failed to connect to backend server at:', targetUrl, networkError);
      return NextResponse.json(
        {
          message:
            'Cannot reach backend server. Please make sure the backend at http://localhost:3069 is running.',
        },
        { status: 502 }
      );
    }

    const data = (await beResponse.json().catch(() => null)) as BackendLoginResponse | null;

    if (!data || !beResponse.ok || data.status !== 'success' || !data.data?.accessToken) {
      return NextResponse.json(
        { message: data?.message || 'Invalid credentials' },
        { status: beResponse.status >= 400 ? beResponse.status : 401 }
      );
    }

    const { accessToken } = data.data;
    const payload = decodeJwtPayload(accessToken);

    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid token structure received from authentication server' },
        { status: 500 }
      );
    }

    if (payload.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied: Admin role required' }, { status: 403 });
    }

    if (isJwtExpired(payload)) {
      return NextResponse.json(
        { message: 'Authentication token is already expired' },
        { status: 401 }
      );
    }

    let maxAge = DEFAULT_COOKIE_MAX_AGE;
    if (typeof payload.exp === 'number') {
      const remaining = payload.exp - Math.floor(Date.now() / 1000);
      if (remaining > 0) {
        maxAge = remaining;
      }
    }

    const secret = getSessionSecret();
    if (!secret) {
      console.error('AUTH_SESSION_SECRET is not configured');
      return NextResponse.json(
        { message: 'Authentication service configuration error' },
        { status: 500 }
      );
    }
    const sessionToken = await createSignedSessionToken(
      {
        accessToken,
        userId: payload.userId,
        role: payload.role,
        exp: payload.exp,
      },
      secret
    );

    const response = NextResponse.json({
      status: 'success',
      statusCode: 200,
      message: data.message || 'Login successfully',
      user: {
        userId: payload.userId,
        role: payload.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error) {
    console.error('Unhandled error during login:', error);
    return NextResponse.json(
      { message: 'An unexpected authentication error occurred' },
      { status: 500 }
    );
  }
}
