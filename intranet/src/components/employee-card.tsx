import Link from 'next/link';

import { Avatar } from '@/components/avatar';
import type { Employee } from '@/lib/types';

export function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <article className="group surface-card flex h-full flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-coral-200 hover:shadow-[0_22px_55px_rgba(180,74,45,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <Avatar employee={employee} size="lg" />
        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[0.67rem] font-bold text-slate-500">
          {employee.location}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-black tracking-tight text-slate-950 group-hover:text-coral-700">
          {employee.fullName}
        </h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">{employee.jobTitle}</p>
        <p className="mt-0.5 text-xs font-bold text-mint-800">{employee.department}</p>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{employee.bio}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {employee.interests.slice(0, 3).map((interest) => (
          <span
            key={interest}
            className="rounded-full bg-coral-50 px-2.5 py-1 text-[0.7rem] font-bold text-coral-700"
          >
            {interest}
          </span>
        ))}
      </div>
      <Link
        className="mt-5 inline-flex items-center gap-2 text-sm font-black text-slate-800 after:absolute after:inset-0 hover:text-coral-700"
        href={`/employees/${employee.slug}`}
      >
        Xem hồ sơ <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
