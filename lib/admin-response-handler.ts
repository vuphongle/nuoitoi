import { AdminAuthorizationError, getAdminAuthorizationStatus } from './admin-auth-response.ts';

interface AdminResponseInput {
  httpStatus: unknown;
  payload: unknown;
  cleanup: () => void | Promise<void>;
}

export async function handleAdminResponse({
  httpStatus,
  payload,
  cleanup,
}: AdminResponseInput): Promise<void> {
  const status = getAdminAuthorizationStatus(httpStatus, payload);
  if (status === null) return;

  await cleanup();
  throw new AdminAuthorizationError(status, payload);
}
