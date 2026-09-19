import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell";
import { EmployeeDirectory } from "@/components/employee-directory";
import { getDepartments, getEmployees, requireViewer } from "@/lib/data";

export const metadata: Metadata = {
  title: "Đồng nghiệp",
  description: "Khám phá những người đang cùng bạn tạo nên Nhà Mình.",
};

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const [viewer, employees, departments] = await Promise.all([
    requireViewer(),
    getEmployees(),
    getDepartments(),
  ]);

  return (
    <AppShell viewer={viewer}>
      <section className="mb-7 grid gap-5 rounded-[2rem] border border-mint-100 bg-gradient-to-br from-white to-mint-50 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <span className="eyebrow">Danh bạ sống</span>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl">
            Gặp những người tạo nên Nhà Mình.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Tìm đúng người để hỏi một việc, rủ một bữa trưa hoặc bắt đầu một câu chuyện mới.
          </p>
        </div>
        <div className="flex gap-6 rounded-2xl bg-white/80 px-5 py-4 shadow-sm">
          <div>
            <strong className="block text-2xl font-black text-slate-950">{employees.length}</strong>
            <span className="text-xs font-semibold text-slate-500">thành viên</span>
          </div>
          <div className="w-px bg-slate-200" />
          <div>
            <strong className="block text-2xl font-black text-slate-950">{departments.length}</strong>
            <span className="text-xs font-semibold text-slate-500">phòng ban</span>
          </div>
        </div>
      </section>

      <EmployeeDirectory departments={departments} employees={employees} />
    </AppShell>
  );
}
