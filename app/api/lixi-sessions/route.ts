import { NextRequest } from 'next/server';
import { proxyAdminRequest, proxyAdminMultipartRequest } from '@/lib/admin-proxy';

export async function GET(request: NextRequest) {
  return proxyAdminRequest(request, 'admin/lixi-sessions');
}

export async function POST(request: NextRequest) {
  return proxyAdminMultipartRequest(request, 'admin/lixi-sessions');
}
