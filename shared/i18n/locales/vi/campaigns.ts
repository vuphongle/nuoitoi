const campaigns = {
  // Page titles
  campaigns: 'Chiến Dịch',
  manageYourCampaigns: 'Quản lý và giám sát các chiến dịch quảng cáo của bạn',

  // Actions
  createCampaign: 'Tạo Chiến Dịch',
  editCampaign: 'Chỉnh Sửa Chiến Dịch',
  deleteCampaign: 'Xóa Chiến Dịch',
  view: 'Xem Chi Tiết',
  edit: 'Sửa',
  delete: 'Xóa',
  cancel: 'Hủy',
  save: 'Lưu',
  refresh: 'Làm Mới',
  export: 'Xuất File',
  pause: 'Tạm Dừng',
  resume: 'Tiếp Tục',
  clearFilters: 'Xóa bộ lọc',

  // Table headers
  campaign: 'Chiến Dịch',
  status: 'Trạng Thái',
  budget: 'Ngân Sách',
  spent: 'Đã Chi',
  impressions: 'Lượt Hiển Thị',
  clicks: 'Lượt Nhấp',
  startDate: 'Ngày Bắt Đầu',
  endDate: 'Ngày Kết Thúc',
  actions: 'Hành Động',

  // Status
  status_active: 'Hoạt Động',
  status_pending: 'Đang Chờ',
  status_completed: 'Hoàn Thành',
  status_paused: 'Tạm Dừng',
  status_draft: 'Bản Nháp',

  // Type
  type: 'Loại',
  allTypes: 'Tất Cả Thể Loại',
  type_awareness: 'Nhận Diện',
  type_engagement: 'Tương Tác',
  type_conversion: 'Chuyển Đổi',
  type_retention: 'Giữ Chân',

  // Filters
  searchCampaigns: 'Tìm kiếm chiến dịch...',
  allStatus: 'Tất Cả Trạng Thái',
  filterByStatus: 'Lọc theo trạng thái',
  filterByType: 'Lọc theo loại',
  allBrands: 'Tất Cả Brand',
  allAgencies: 'Tất Cả Agency',
  filterByBrand: 'Lọc theo brand',
  filterByAgency: 'Lọc theo agency',

  // Stats
  activeCampaigns: 'Hoạt Động',
  totalBudget: 'Tổng Ngân Sách',
  totalImpressions: 'Tổng Lượt Hiển Thị',
  allTime: 'tất cả thời gian',
  averageCtr: 'CTR Trung Bình',
  acrossAllCampaigns: 'trên tất cả chiến dịch',
  active: 'Hoạt Động',

  // Empty state
  noCampaignsFound: 'Không tìm thấy chiến dịch nào',
  getStartedByCreating: 'Bắt đầu bằng cách tạo chiến dịch đầu tiên của bạn',

  // Dialogs
  deleteConfirmation:
    "Bạn có chắc chắn muốn xóa chiến dịch '{name}'? Hành động này không thể hoàn tác.",

  // Messages
  campaignCreated: 'Tạo chiến dịch thành công',
  campaignUpdated: 'Cập nhật chiến dịch thành công',
  campaignDeleted: 'Xóa chiến dịch thành công',
  campaignPaused: 'Chiến dịch đã tạm dừng',
  campaignResumed: 'Chiến dịch đã tiếp tục',
} as const;

export default campaigns;
