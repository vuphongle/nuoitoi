export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'guest';
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'guest';
}
