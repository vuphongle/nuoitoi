'use client';

import { useMemo, useState } from 'react';

import { EmployeeCard } from '@/components/employee-card';
import type { Department, Employee } from '@/lib/types';

export function EmployeeDirectory({
  employees,
  departments,
  compact = false,
}: {
  employees: Employee[];
  departments: Department[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('all');

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    return employees.filter((employee) => {
      const matchesDepartment = department === 'all' || employee.departmentId === department;
      const haystack =
        `${employee.fullName} ${employee.jobTitle} ${employee.department} ${employee.interests.join(' ')}`.toLocaleLowerCase(
          'vi'
        );
      return matchesDepartment && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [department, employees, query]);

  return (
    <div>
      {!compact && (
        <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm sm:grid-cols-[1fr_220px]">
          <label className="relative">
            <span className="sr-only">Tìm theo tên, chức vụ hoặc sở thích</span>
            <span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden
            >
              ⌕
            </span>
            <input
              className="field-input pl-10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm tên, chức vụ, sở thích..."
              type="search"
              value={query}
            />
          </label>
          <label>
            <span className="sr-only">Lọc theo phòng ban</span>
            <select
              className="field-input"
              onChange={(event) => setDepartment(event.target.value)}
              value={department}
            >
              <option value="all">Tất cả phòng ban</option>
              {departments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {filteredEmployees.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div className="relative" key={employee.id}>
              <EmployeeCard employee={employee} />
            </div>
          ))}
        </div>
      ) : (
        <div className="surface-card px-6 py-14 text-center">
          <span className="text-3xl" aria-hidden>
            ⌕
          </span>
          <h3 className="mt-3 text-lg font-black text-slate-900">
            Chưa tìm thấy đồng nghiệp phù hợp
          </h3>
          <p className="mt-1 text-sm text-slate-500">Thử một từ khóa hoặc phòng ban khác nhé.</p>
        </div>
      )}
    </div>
  );
}
