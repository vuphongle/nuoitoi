import { NextRequest } from 'next/server';
import { proxyAdminRequest } from '@/lib/admin-proxy';

export async function GET(request: NextRequest) {
  return proxyAdminRequest(request, 'admin/feedbacks');
}

export async function POST(request: NextRequest) {
  return proxyAdminRequest(request, 'admin/feedbacks');
}
