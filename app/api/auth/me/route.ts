import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  getSessionSecret,
  isJwtExpired,
  verifySignedSessionToken,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const secret = getSessionSecret();
  if (!secret) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifySignedSessionToken(token, secret);
  if (!session || session.role !== 'admin' || isJwtExpired(session)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      role: session.role,
    },
  });
}
