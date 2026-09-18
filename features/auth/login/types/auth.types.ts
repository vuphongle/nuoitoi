export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  statusCode: number;
  message?: string;
  user: {
    userId: number | string;
    role: string;
  };
}
