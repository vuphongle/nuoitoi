'use client';

import { useActionState } from 'react';

import { saveProfile, type ProfileFormState } from '@/app/profile/edit/actions';
import type { Department, Employee } from '@/lib/types';

const initialState: ProfileFormState = {};

export function ProfileForm({
  employee,
  departments,
}: {
  employee: Employee;
  departments: Department[];
}) {
  const [state, action, pending] = useActionState(saveProfile, initialState);

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Họ và tên" name="fullName" error={state.errors?.fullName?.[0]}>
          <input
            className="field-input"
            defaultValue={employee.fullName}
            id="fullName"
            name="fullName"
            required
          />
        </Field>
        <Field label="Chức vụ" name="jobTitle" error={state.errors?.jobTitle?.[0]}>
          <input
            className="field-input"
            defaultValue={employee.jobTitle}
            id="jobTitle"
            name="jobTitle"
            required
          />
        </Field>
        <Field label="Phòng ban" name="departmentId" error={state.errors?.departmentId?.[0]}>
          <select
            className="field-input"
            defaultValue={employee.departmentId || departments[0]?.id}
            id="departmentId"
            name="departmentId"
            required
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Địa điểm làm việc" name="location" error={state.errors?.location?.[0]}>
          <input
            className="field-input"
            defaultValue={employee.location}
            id="location"
            name="location"
            required
          />
        </Field>
      </div>

      <Field
        label="Giới thiệu ngắn"
        name="bio"
        error={state.errors?.bio?.[0]}
        help="Tối đa 280 ký tự. Một câu chuyện thật thường dễ bắt chuyện hơn."
      >
        <textarea
          className="field-input"
          defaultValue={employee.bio}
          id="bio"
          maxLength={280}
          name="bio"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1.35fr_0.65fr]">
        <Field
          label="Sở thích"
          name="interests"
          error={state.errors?.interests?.[0]}
          help="Phân tách bằng dấu phẩy, tối đa 8 sở thích."
        >
          <input
            className="field-input"
            defaultValue={employee.interests.join(', ')}
            id="interests"
            name="interests"
            placeholder="Cà phê, chạy bộ, board game"
          />
        </Field>
        <Field label="Ngày gia nhập" name="joinedDate" error={state.errors?.joinedDate?.[0]}>
          <input
            className="field-input"
            defaultValue={employee.joinedDate}
            id="joinedDate"
            name="joinedDate"
            required
            type="date"
          />
        </Field>
      </div>

      {state.message && (
        <p
          className={`rounded-xl border p-3 text-sm font-semibold ${state.success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}
          role="status"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <p className="text-xs text-slate-400">
          Thông tin này chỉ hiển thị cho thành viên đã đăng nhập.
        </p>
        <button className="button button-primary min-w-36" disabled={pending} type="submit">
          {pending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );
}

function Field({
  children,
  error,
  help,
  label,
  name,
}: {
  children: React.ReactNode;
  error?: string;
  help?: string;
  label: string;
  name: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-semibold text-rose-700">{error}</p>
      ) : help ? (
        <p className="field-help">{help}</p>
      ) : null}
    </div>
  );
}
