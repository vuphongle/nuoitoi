import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  getSessionSecret,
  isJwtExpired,
  verifySignedSessionToken,
} from '@/lib/auth';
import {
  getAdminAuthorizationStatus,
  type AdminAuthorizationStatus,
} from '@/lib/admin-auth-response';

function adminAuthFailureResponse(
  status: AdminAuthorizationStatus,
  payload: unknown,
  fallbackMessage: string
) {
  const body =
    typeof payload === 'object' && payload !== null
      ? payload
      : { success: false, statusCode: status, message: fallbackMessage };
  const response = NextResponse.json(body, { status });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}

export async function proxyAdminRequest(
  request: NextRequest,
  endpointPath: string,
  extraParams?: Record<string, string>
) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const secret = getSessionSecret();

    if (!token || !secret) {
      return adminAuthFailureResponse(
        401,
        null,
        'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn'
      );
    }

    const session = await verifySignedSessionToken(token, secret);
    if (!session || session.role !== 'admin' || isJwtExpired(session)) {
      return adminAuthFailureResponse(401, null, 'Phiên làm việc không hợp lệ hoặc đã hết hạn');
    }

    const beBaseUrl = process.env.BE_API_URL || 'http://localhost:3069/api';
    const { searchParams } = new URL(request.url);

    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => {
        searchParams.set(k, v);
      });
    }

    const queryString = searchParams.toString();
    const cleanEndpoint = endpointPath.replace(/^\/+/, '');
    const targetUrl = `${beBaseUrl.replace(/\/+$/, '')}/${cleanEndpoint}${
      queryString ? `?${queryString}` : ''
    }`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    };

    const method = request.method.toUpperCase();
    let body: string | undefined;

    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const jsonBody = await request.json();
        body = JSON.stringify(jsonBody);
      } catch {
        // Body is empty or not JSON
      }
    }

    let beResponse: Response;
    try {
      beResponse = await fetch(targetUrl, {
        method,
        headers,
        body,
      });
    } catch (networkError) {
      console.error('Failed to proxy admin request to:', targetUrl, networkError);
      return NextResponse.json(
        {
          success: false,
          message: 'Không thể kết nối đến máy chủ backend tại ' + beBaseUrl,
        },
        { status: 502 }
      );
    }

    const data = await beResponse.json().catch(() => null);
    const authorizationStatus = getAdminAuthorizationStatus(beResponse.status, data);
    if (authorizationStatus !== null) {
      return adminAuthFailureResponse(
        authorizationStatus,
        data,
        'Phiên làm việc không hợp lệ hoặc đã hết hạn'
      );
    }

    return NextResponse.json(data, { status: beResponse.status });
  } catch (error) {
    console.error('Unhandled error in proxyAdminRequest:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}
