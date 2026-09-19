import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/avatar";
import { getEmployee, requireViewer } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/employees/[id]">): Promise<Metadata> {
  const { id } = await params;
  const employee = await getEmployee(id);
  return employee
    ? { title: employee.fullName, description: `${employee.jobTitle} tại ${employee.department}` }
    : { title: "Không tìm thấy hồ sơ" };
}

function formatJoinedDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(new Date(value));
}

export default async function EmployeeDetailPage({ params }: PageProps<"/employees/[id]">) {
  const { id } = await params;
  const [viewer, employee] = await Promise.all([requireViewer(), getEmployee(id)]);

  if (!employee) notFound();

  return (
    <AppShell viewer={viewer}>
      <Link className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-coral-700" href="/employees">
        <span aria-hidden>←</span> Quay lại danh bạ
      </Link>

      <section className="surface-card overflow-hidden">
        <div className="relative h-36 bg-gradient-to-r from-coral-100 via-orange-50 to-mint-100 sm:h-44">
          <span className="absolute right-8 top-5 text-5xl text-white/70" aria-hidden>✦</span>
        </div>
        <div className="px-5 pb-7 sm:px-8 sm:pb-9">
          <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar employee={employee} size="xl" bordered />
              <div className="sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{employee.fullName}</h1>
                  {employee.role !== "user" && (
                    <span className="rounded-full bg-mint-100 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-mint-800">
                      {employee.role === "admin" ? "Admin" : "Điều phối"}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-bold text-slate-600">{employee.jobTitle} · {employee.department}</p>
              </div>
            </div>
            <a className="button button-primary sm:mb-1" href={`mailto:${employee.email}`}>
              Gửi lời chào <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
              <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Một chút về mình</span>
              <p className="mt-3 text-base leading-7 text-slate-700">{employee.bio}</p>
              <div className="mt-6">
                <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Có thể bắt chuyện bằng</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {employee.interests.length > 0 ? employee.interests.map((interest) => (
                    <span key={interest} className="rounded-full border border-coral-100 bg-white px-3 py-1.5 text-xs font-bold text-coral-700">
                      {interest}
                    </span>
                  )) : <span className="text-sm text-slate-500">Chưa cập nhật sở thích.</span>}
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-100 p-5 sm:p-6">
              <h2 className="font-black text-slate-900">Thông tin nhanh</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Địa điểm</dt>
                  <dd className="mt-1 font-semibold text-slate-700">{employee.location}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Gia nhập</dt>
                  <dd className="mt-1 font-semibold text-slate-700">{formatJoinedDate(employee.joinedDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</dt>
                  <dd className="mt-1 break-all font-semibold text-slate-700">{employee.email}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
