'use client';

import Link from 'next/link';
import { useState } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function LoginForm({ demoMode }: { demoMode: boolean }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function signInWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    setPending(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/` },
    });

    setPending(false);
    setMessage(error ? error.message : 'Đã gửi đường dẫn đăng nhập. Bạn kiểm tra email nhé!');
  }

  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    setPending(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` },
    });
    if (error) {
      setPending(false);
      setMessage(error.message);
    }
  }

  if (demoMode) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-bold text-amber-900">Ứng dụng đang ở chế độ xem thử.</p>
        <p className="mt-1 text-xs leading-5 text-amber-800">
          Kết nối Supabase để bật đăng nhập bằng email công ty.
        </p>
        <Link className="button button-primary mt-4 w-full" href="/">
          Vào bản demo <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        className="button button-secondary w-full"
        disabled={pending}
        onClick={signInWithGoogle}
        type="button"
      >
        <span
          className="grid size-6 place-items-center rounded-full bg-slate-950 text-xs font-black text-white"
          aria-hidden
        >
          G
        </span>
        Tiếp tục với Google
      </button>
      <div className="my-5 flex items-center gap-3 text-xs font-semibold text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> hoặc{' '}
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <form onSubmit={signInWithEmail}>
        <label className="field-label" htmlFor="email">
          Email công ty
        </label>
        <input
          autoComplete="email"
          className="field-input"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ban@congty.vn"
          required
          type="email"
          value={email}
        />
        <button className="button button-primary mt-3 w-full" disabled={pending} type="submit">
          {pending ? 'Đang gửi...' : 'Gửi đường dẫn đăng nhập'}
        </button>
      </form>
      {message && (
        <p
          className="mt-3 rounded-xl bg-slate-50 p-3 text-center text-xs leading-5 text-slate-600"
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
