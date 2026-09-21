import type { Employee } from '@/lib/types';

type AvatarProps = {
  employee: Pick<Employee, 'fullName' | 'initials' | 'avatarUrl' | 'accent'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
};

const sizeClasses = {
  sm: 'size-8 text-[0.65rem]',
  md: 'size-11 text-xs',
  lg: 'size-16 text-base',
  xl: 'size-28 text-2xl',
};

const accentClasses = {
  coral: 'from-orange-100 to-rose-200 text-rose-800',
  mint: 'from-emerald-100 to-teal-200 text-emerald-900',
  amber: 'from-amber-100 to-yellow-200 text-amber-900',
  blue: 'from-sky-100 to-blue-200 text-blue-900',
  violet: 'from-violet-100 to-fuchsia-200 text-violet-900',
  rose: 'from-pink-100 to-rose-200 text-rose-900',
};

export function Avatar({ employee, size = 'md', bordered = false }: AvatarProps) {
  const borderClass = bordered ? 'ring-2 ring-white' : '';

  if (employee.avatarUrl) {
    return (
      // Avatar paths may point to a private signed URL, so a plain img is intentional.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={`Ảnh đại diện của ${employee.fullName}`}
        className={`${sizeClasses[size]} ${borderClass} shrink-0 rounded-full object-cover`}
        src={employee.avatarUrl}
      />
    );
  }

  return (
    <span
      aria-label={`Ảnh đại diện viết tắt của ${employee.fullName}`}
      className={`${sizeClasses[size]} ${accentClasses[employee.accent]} ${borderClass} grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-black tracking-tight`}
      role="img"
    >
      {employee.initials}
    </span>
  );
}
