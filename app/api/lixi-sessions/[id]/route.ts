import { NextRequest } from 'next/server';
import { proxyAdminRequest, proxyAdminMultipartRequest } from '@/lib/admin-proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyAdminRequest(request, `admin/lixi-sessions/${id}`);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyAdminMultipartRequest(request, `admin/lixi-sessions/${id}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyAdminRequest(request, `admin/lixi-sessions/${id}`);
}
