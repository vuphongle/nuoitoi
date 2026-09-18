import type { Metadata } from "next";

import { ProfileForm } from "@/app/profile/edit/profile-form";
import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/avatar";
import { getDepartments, requireViewer } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Chỉnh sửa hồ sơ" };
export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const [viewer, departments] = await Promise.all([requireViewer(), getDepartments()]);

  return (
    <AppShell viewer={viewer}>
      <section className="mx-auto max-w-4xl">
        <div className="mb-6">
          <span className="eyebrow">Góc của bạn</span>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-slate-950">Cập nhật hồ sơ</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Chia sẻ vừa đủ để đồng nghiệp biết bạn làm gì và có thể bắt chuyện về điều gì.
          </p>
        </div>

        {!hasSupabaseEnv() && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <strong>Chế độ demo:</strong> form sẽ kiểm tra dữ liệu nhưng chưa ghi vào cơ sở dữ liệu.
          </div>
        )}

        <div className="surface-card overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-coral-50 to-white p-5 sm:flex-row sm:items-center sm:p-7">
            <Avatar employee={viewer} size="lg" />
            <div className="min-w-0">
              <p className="font-black text-slate-950">{viewer.fullName}</p>
              <p className="truncate text-sm text-slate-500">{viewer.email}</p>
              <p className="mt-1 text-xs font-semibold text-coral-700">Tải ảnh đại diện sẽ được bổ sung ở bước tiếp theo.</p>
            </div>
          </div>
          <div className="p-5 sm:p-7">
            <ProfileForm departments={departments} employee={viewer} />
          </div>
        </div>

        {hasSupabaseEnv() && (
          <form action="/auth/signout" className="mt-6 text-center" method="post">
            <button className="text-sm font-bold text-slate-500 hover:text-rose-700" type="submit">Đăng xuất khỏi Nhà Mình</button>
          </form>
        )}
      </section>
    </AppShell>
  );
}
