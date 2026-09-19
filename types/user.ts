export interface UserItem {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | string;
  gender?: 'male' | 'female' | 'other' | string;
  birth_day?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUserListResponse {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: UserItem[];
}

export interface AdminUserDetailResponse {
  status?: string;
  statusCode?: number;
  message?: string;
  data: UserItem;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birth_day?: string;
  gender?: string;
  role?: string;
  avatar?: string;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  birth_day?: string;
  gender?: string;
  role?: string;
  avatar?: string;
}

export interface AdminUserQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export type ProfileGender = 'Male' | 'Female' | 'Other';
export type ProfileLanguage = 'vi' | 'en';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  birth_day: string;
  gender: ProfileGender;
  role: string;
  avatar: string;
  lang: ProfileLanguage;
  created_at: string;
  updated_at: string;
}

export interface ProfileResponse {
  status: string;
  statusCode: number;
  message?: string;
  data: UserProfile;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  birth_day?: string;
  gender?: ProfileGender;
  avatar?: string;
  lang?: ProfileLanguage;
}

export interface UpdatePasswordPayload {
  password: string;
}

// Aliases for compatibility
export type User = UserItem;
export type CreateUserPayload = CreateAdminUserPayload;
export type UpdateUserPayload = UpdateAdminUserPayload;
