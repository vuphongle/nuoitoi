type ApiErrorLike = {
  message?: unknown;
  response?: { data?: { message?: unknown } };
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== 'object' || error === null) return fallback;

  const candidate = error as ApiErrorLike;
  const backendMessage = candidate.response?.data?.message;
  if (typeof backendMessage === 'string' && backendMessage.trim()) return backendMessage;
  if (typeof candidate.message === 'string' && candidate.message.trim()) return candidate.message;
  return fallback;
}
