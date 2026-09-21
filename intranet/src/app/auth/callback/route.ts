import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next');
  const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : '/';

  if (!code) return NextResponse.redirect(new URL('/login?error=auth', url.origin));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/login?error=auth', url.origin));

  const { data } = await supabase.auth.getUser();
  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLocaleLowerCase();
  const email = data.user?.email?.toLocaleLowerCase();

  if (allowedDomain && (!email || !email.endsWith(`@${allowedDomain}`))) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login?error=domain', url.origin));
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
