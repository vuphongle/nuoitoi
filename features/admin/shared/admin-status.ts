export type AdminStatusTone = 'gray' | 'green' | 'yellow' | 'zinc' | 'red' | 'blue';

export interface AdminStatusConfig {
  tone: AdminStatusTone;
  className: string;
}

const toneClasses: Record<AdminStatusTone, string> = {
  gray: 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200',
  green:
    'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  yellow:
    'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
  zinc: 'border-zinc-300 bg-zinc-200 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
  red: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
  blue: 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
};

const statusTones: Record<string, AdminStatusTone> = {
  draft: 'gray',
  published: 'green',
  active: 'green',
  pending: 'yellow',
  admin: 'yellow',
  archived: 'zinc',
  deleted: 'red',
  inactive: 'red',
  editor: 'blue',
  user: 'gray',
};

export function normalizeAdminStatus(status: unknown): string {
  return typeof status === 'string' ? status.trim().toLowerCase() : '';
}

export function getAdminStatusConfig(status: unknown): AdminStatusConfig {
  const tone = statusTones[normalizeAdminStatus(status)] ?? 'gray';
  return { tone, className: toneClasses[tone] };
}
