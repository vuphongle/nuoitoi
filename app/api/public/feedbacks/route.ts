import { NextRequest, NextResponse } from 'next/server';

// Endpoint công khai - client gửi feedback không cần đăng nhập, không đính kèm cookie admin.
export async function POST(request: NextRequest) {
  const beBaseUrl = process.env.BE_API_URL || 'http://localhost:3069/api';
  const targetUrl = `${beBaseUrl.replace(/\/+$/, '')}/feedbacks`;

  let jsonBody: unknown;
  try {
    jsonBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Dữ liệu gửi lên không hợp lệ' },
      { status: 400 }
    );
  }

  let beResponse: Response;
  try {
    beResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonBody),
    });
  } catch (networkError) {
    console.error('Failed to proxy public feedback request to:', targetUrl, networkError);
    return NextResponse.json(
      { success: false, message: 'Không thể kết nối đến máy chủ backend tại ' + beBaseUrl },
      { status: 502 }
    );
  }

  const data = await beResponse.json().catch(() => null);
  return NextResponse.json(data, { status: beResponse.status });
}
