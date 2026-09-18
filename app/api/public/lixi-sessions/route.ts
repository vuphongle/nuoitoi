import { NextResponse } from 'next/server';

// Endpoint công khai - danh sách lixi-sessions hiển thị ở trang chủ, không cần đăng nhập.
export async function GET() {
  const beBaseUrl = process.env.BE_API_URL || 'http://localhost:3069/api';
  const targetUrl = `${beBaseUrl.replace(/\/+$/, '')}/lixi-sessions`;

  let beResponse: Response;
  try {
    beResponse = await fetch(targetUrl, { method: 'GET' });
  } catch (networkError) {
    console.error('Failed to proxy public lixi-sessions request to:', targetUrl, networkError);
    return NextResponse.json(
      { success: false, message: 'Không thể kết nối đến máy chủ backend tại ' + beBaseUrl },
      { status: 502 }
    );
  }

  const data = await beResponse.json().catch(() => null);
  return NextResponse.json(data, { status: beResponse.status });
}
