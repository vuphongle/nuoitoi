export interface LixiSessionItem {
  id: number;
  code: string;
  name: string;
  tagline: string;
  bank: string;
  account: string;
  owner: string;
  content: string;
  qr: string;
  avatar: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminLixiSessionListResponse {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: LixiSessionItem[];
}

// Raw shape returned by the API for the list endpoint: the paginated payload
// above is nested under `data`, alongside the status envelope.
export interface LixiSessionListEnvelope {
  status?: string;
  statusCode?: number;
  message?: string;
  data: AdminLixiSessionListResponse;
}

export interface AdminLixiSessionDetailResponse {
  status?: string;
  statusCode?: number;
  message?: string;
  data: LixiSessionItem;
}

export interface AdminLixiSessionQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

// GET /public/lixi-sessions (public, không cần đăng nhập) - trả thẳng mảng, không phân trang.
export interface PublicLixiSessionListResponse {
  status?: string;
  statusCode?: number;
  message?: string;
  data: LixiSessionItem[];
}

export interface LixiSessionFormValues {
  code: string;
  name: string;
  tagline: string;
  bank: string;
  account: string;
  owner: string;
  content: string;
  sort_order?: number;
  qr?: File | null;
  avatar?: File | null;
}
