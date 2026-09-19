import type { NextRequest } from 'next/server';
import { proxyAdminRequest } from '@/lib/admin-proxy';

export async function GET(request: NextRequest) {
  return proxyAdminRequest(request, 'users/profile');
}

export async function PATCH(request: NextRequest) {
  return proxyAdminRequest(request, 'users/profile');
}
