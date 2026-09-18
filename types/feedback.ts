// Phải khớp với CHECK constraint của cột `type` trên bảng `feedbacks` ở BE:
// CHECK (type IN ('bug', 'feature_request', 'improvement', 'general'))
export const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Báo lỗi' },
  { value: 'feature_request', label: 'Đề xuất tính năng' },
  { value: 'improvement', label: 'Góp ý cải thiện' },
  { value: 'general', label: 'Khác' },
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number]['value'];

export interface FeedbackItem {
  id: number;
  name: string;
  type: string;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminFeedbackListResponse {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: FeedbackItem[];
}

// Raw shape returned by the API for the list endpoint: the paginated payload
// above is nested under `data`, alongside the status envelope.
export interface FeedbackListEnvelope {
  status?: string;
  statusCode?: number;
  message?: string;
  data: AdminFeedbackListResponse;
}

export interface AdminFeedbackDetailResponse {
  status?: string;
  statusCode?: number;
  message?: string;
  data: FeedbackItem;
}

export interface AdminFeedbackQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  type?: string;
}

export interface CreateFeedbackPayload {
  name: string;
  type: string;
  title: string;
  description: string;
}

export type UpdateFeedbackPayload = Partial<CreateFeedbackPayload>;
