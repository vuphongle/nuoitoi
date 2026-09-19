import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";
import { hasSupabaseEnv } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Đăng nhập" };

const messages: Record<string, string> = {
  domain: "Email này không thuộc tên miền công ty được phép.",
  auth: "Đường dẫn đăng nhập không hợp lệ hoặc đã hết hạn.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const errorCode = Array.isArray(error) ? error[0] : error;

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 -top-20 size-96 rounded-full bg-coral-500/25 blur-3xl" />
        <div className="absolute -bottom-20 right-0 size-80 rounded-full bg-mint-600/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">NM</span>
          <strong className="text-lg font-black tracking-tight">NHÀ MÌNH</strong>
        </div>
        <div className="relative max-w-xl">
          <span className="text-5xl text-coral-300" aria-hidden>“</span>
          <h1 className="mt-3 text-5xl font-black leading-[1.08] tracking-[-0.045em]">
            Một nơi nhỏ để những người cùng làm việc hiểu nhau hơn.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Tìm đồng nghiệp, chia sẻ sở thích và lưu lại những khoảnh khắc vui của cả đội ngũ.
          </p>
        </div>
        <p className="relative text-xs font-semibold text-slate-500">Chỉ dành cho thành viên công ty.</p>
      </section>

      <section className="grid place-items-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">NM</span>
            <strong className="text-base font-black text-slate-950">NHÀ MÌNH</strong>
          </div>
          <span className="eyebrow">Rất vui được gặp bạn</span>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950">Đăng nhập vào ngôi nhà chung</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Sử dụng email công ty để tiếp tục.</p>

          {errorCode && messages[errorCode] && (
            <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800" role="alert">
              {messages[errorCode]}
            </p>
          )}

          <div className="mt-7">
            <LoginForm demoMode={!hasSupabaseEnv()} />
          </div>
          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Khi tiếp tục, bạn đồng ý tuân thủ quy định sử dụng nội bộ của công ty.
          </p>
        </div>
      </section>
    </main>
  );
}
