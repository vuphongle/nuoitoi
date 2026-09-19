export type AdminPaginationItem = number | 'ellipsis';

export interface AdminPaginationModel {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: AdminPaginationItem[];
}

function sanitizePositiveInteger(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function getAdminPaginationModel(
  currentPage: number,
  totalPages: number
): AdminPaginationModel {
  const safeTotalPages = sanitizePositiveInteger(totalPages);

  if (safeTotalPages === 0) {
    return {
      currentPage: 0,
      totalPages: 0,
      hasPrevious: false,
      hasNext: false,
      items: [],
    };
  }

  const requestedPage = Number.isFinite(currentPage) ? Math.floor(currentPage) : 1;
  const safeCurrentPage = Math.min(safeTotalPages, Math.max(1, requestedPage));
  let items: AdminPaginationItem[];

  if (safeTotalPages <= 7) {
    items = Array.from({ length: safeTotalPages }, (_, index) => index + 1);
  } else if (safeCurrentPage <= 4) {
    items = [1, 2, 3, 4, 5, 'ellipsis', safeTotalPages];
  } else if (safeCurrentPage >= safeTotalPages - 3) {
    items = [
      1,
      'ellipsis',
      safeTotalPages - 4,
      safeTotalPages - 3,
      safeTotalPages - 2,
      safeTotalPages - 1,
      safeTotalPages,
    ];
  } else {
    items = [
      1,
      'ellipsis',
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      'ellipsis',
      safeTotalPages,
    ];
  }

  return {
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    hasPrevious: safeCurrentPage > 1,
    hasNext: safeCurrentPage < safeTotalPages,
    items,
  };
}
