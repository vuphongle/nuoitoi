import type { LoginRequest, LoginResponse } from '../types';

export const loginApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = (await response.json().catch(() => null)) as
      | ({ message?: string } & Partial<LoginResponse>)
      | null;

    if (!response.ok || !data?.user) {
      throw new Error(data?.message || 'Login failed');
    }

    return data as LoginResponse;
  },
};
