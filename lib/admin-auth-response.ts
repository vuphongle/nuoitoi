export type AdminAuthorizationStatus = 401 | 403;

type ResponsePayload = {
  message?: unknown;
  statusCode?: unknown;
};

function asResponsePayload(payload: unknown): ResponsePayload | null {
  return typeof payload === 'object' && payload !== null ? (payload as ResponsePayload) : null;
}

function asAdminAuthorizationStatus(value: unknown): AdminAuthorizationStatus | null {
  if (value === 401 || value === '401') {
    return 401;
  }

  if (value === 403 || value === '403') {
    return 403;
  }

  return null;
}

function getAuthorizationMessage(status: AdminAuthorizationStatus, payload: unknown): string {
  const message = asResponsePayload(payload)?.message;
  return typeof message === 'string' && message.trim()
    ? message
    : `Admin authorization failed with status ${status}`;
}

export class AdminAuthorizationError extends Error {
  readonly status: AdminAuthorizationStatus;

  constructor(status: AdminAuthorizationStatus, payload?: unknown) {
    super(getAuthorizationMessage(status, payload));
    this.name = 'AdminAuthorizationError';
    this.status = status;
  }
}

export class AdminRoleError extends Error {
  constructor(message = 'Administrator role required') {
    super(message);
    this.name = 'AdminRoleError';
  }
}

export function getAdminAuthorizationStatus(
  httpStatus: unknown,
  payload: unknown
): AdminAuthorizationStatus | null {
  const payloadStatus = asAdminAuthorizationStatus(asResponsePayload(payload)?.statusCode);
  return payloadStatus ?? asAdminAuthorizationStatus(httpStatus);
}

export function throwIfAdminAuthorizationFailure(httpStatus: unknown, payload: unknown): void {
  const status = getAdminAuthorizationStatus(httpStatus, payload);
  if (status !== null) {
    throw new AdminAuthorizationError(status, payload);
  }
}
