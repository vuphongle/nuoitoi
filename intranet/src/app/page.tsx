import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/avatar";
import { EmployeeDirectory } from "@/components/employee-directory";
import { getDepartments, getEmployees, requireViewer } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [viewer, employees, departments] = await Promise.all([
    requireViewer(),
    getEmployees(),
    getDepartments(),
  ]);

  const newTeammates = [...employees]
    .sort((a, b) => b.joinedDate.localeCompare(a.joinedDate))
    .slice(0, 3);

  return (
    <AppShell viewer={viewer}>
      <section className="hero-panel overflow-hidden rounded-[2rem] px-5 py-6 sm:px-8 sm:py-8">
        <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <span className="eyebrow">Chào buổi sáng, {viewer.fullName.split(" ").at(-1)}</span>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Mỗi ngày đi làm,
              <span className="block text-coral-700">thêm một chuyện vui để nhớ.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Khám phá những gương mặt quanh mình, tìm đồng đội cùng sở thích và
              biến văn phòng thành một nơi thân quen hơn.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="button button-primary" href="/employees">
                Khám phá đồng nghiệp <span aria-hidden>→</span>
              </Link>
              <Link className="button button-secondary" href="/profile/edit">
                Hoàn thiện hồ sơ
              </Link>
            </div>
          </div>

          <div className="hero-note rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-mint-100 text-xl" aria-hidden>
                ☀
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint-800">
                  Gợi ý tuần này
                </p>
                <p className="font-bold text-slate-900">Món ăn cứu đói lúc 3 giờ chiều?</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Một chủ đề nhẹ nhàng để bắt chuyện với người ngồi cách bạn vài dãy bàn.
            </p>
            <div className="mt-4 flex -space-x-2" aria-label="5 đồng nghiệp đang tham gia">
              {employees.slice(0, 5).map((employee) => (
                <Avatar key={employee.id} employee={employee} size="sm" bordered />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="stat-card">
          <p className="stat-kicker">Đồng nghiệp</p>
          <div className="mt-2 flex items-end justify-between">
            <strong>{employees.length}</strong>
            <span className="stat-icon bg-coral-50 text-coral-700" aria-hidden>◎</span>
          </div>
          <p className="stat-caption">gương mặt trong ngôi nhà chung</p>
        </article>
        <article className="stat-card">
          <p className="stat-kicker">Phòng ban</p>
          <div className="mt-2 flex items-end justify-between">
            <strong>{departments.length}</strong>
            <span className="stat-icon bg-mint-50 text-mint-800" aria-hidden>⌘</span>
          </div>
          <p className="stat-caption">đội ngũ đang cùng phối hợp</p>
        </article>
        <article className="stat-card">
          <p className="stat-kicker">Sở thích phổ biến</p>
          <div className="mt-2 flex items-end justify-between">
            <strong>Cà phê</strong>
            <span className="stat-icon bg-amber-50 text-amber-700" aria-hidden>♨</span>
          </div>
          <p className="stat-caption">lý do chính đáng để rời bàn 5 phút</p>
        </article>
      </section>

      <section className="mt-10">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Làm quen nhanh</span>
            <h2>Ai đang ở quanh bạn?</h2>
          </div>
          <Link className="text-link" href="/employees">
            Xem tất cả <span aria-hidden>→</span>
          </Link>
        </div>
        <EmployeeDirectory employees={employees.slice(0, 6)} departments={departments} compact />
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="surface-card p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Người mới</span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Chào đồng đội mới nhé!</h2>
            </div>
            <span className="hidden rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-700 sm:inline">
              Mới gia nhập
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {newTeammates.map((employee) => (
              <Link
                key={employee.id}
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-coral-200 hover:bg-coral-50/40"
                href={`/employees/${employee.slug}`}
              >
                <Avatar employee={employee} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900 group-hover:text-coral-700">{employee.fullName}</p>
                  <p className="truncate text-sm text-slate-500">{employee.jobTitle} · {employee.department}</p>
                </div>
                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-coral-600" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="surface-card relative overflow-hidden bg-slate-950 p-6 text-white sm:p-7">
          <div className="absolute -right-10 -top-10 size-36 rounded-full bg-coral-500/25 blur-2xl" />
          <span className="relative text-3xl" aria-hidden>✦</span>
          <h2 className="relative mt-6 text-2xl font-black tracking-tight">Hồ sơ càng thật, kết nối càng dễ.</h2>
          <p className="relative mt-3 text-sm leading-6 text-slate-300">
            Thêm một câu giới thiệu và vài sở thích. Biết đâu bạn tìm được hội ăn trưa mới ngay hôm nay.
          </p>
          <Link className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-coral-300 hover:text-white" href="/profile/edit">
            Cập nhật hồ sơ <span aria-hidden>→</span>
          </Link>
        </aside>
      </section>
    </AppShell>
  );
}
