const brands = {
  // Page titles
  brands: 'Thương Hiệu',
  manageYourBrands: 'Quản lý và giám sát các thương hiệu quảng cáo của bạn',

  // Actions
  createBrand: 'Tạo Thương Hiệu',
  editBrand: 'Chỉnh Sửa Thương Hiệu',
  deleteBrand: 'Xóa Thương Hiệu',
  view: 'Xem Chi Tiết',
  edit: 'Sửa',
  delete: 'Xóa',
  cancel: 'Hủy',
  save: 'Lưu',
  refresh: 'Làm Mới',
  export: 'Xuất File',
  clearFilters: 'Xóa bộ lọc',

  // Fields
  brand: 'Thương Hiệu',
  status: 'Trạng Thái',
  budget: 'Ngân Sách',
  spent: 'Đã Chi',
  impressions: 'Lượt Hiển Thị',
  clicks: 'Lượt Nhấp',
  campaigns: 'Chiến Dịch',
  agency: 'Agency',
  website: 'Website',
  actions: 'Hành Động',

  // Status
  status_active: 'Hoạt Động',
  status_inactive: 'Không Hoạt Động',
  status_pending: 'Đang Chờ',

  // Industry
  industry: 'Ngành',
  allIndustries: 'Tất Cả Ngành',
  industry_technology: 'Công Nghệ',
  industry_fashion: 'Thời Trang',
  industry_food: 'Thực Phẩm & Đồ Uống',
  industry_beauty: 'Làm Đẹp',
  industry_finance: 'Tài Chính',
  industry_healthcare: 'Y Tế',
  industry_education: 'Giáo Dục',
  industry_automotive: 'Ô Tô',
  industry_real_estate: 'Bất Động Sản',
  industry_entertainment: 'Giải Trí',
  industry_sports: 'Thể Thao',
  industry_travel: 'Du Lịch',

  // Filters
  searchBrands: 'Tìm kiếm thương hiệu...',
  allStatus: 'Tất Cả Trạng Thái',
  allAgencies: 'Tất Cả Agency',
  filterByStatus: 'Lọc theo trạng thái',
  filterByIndustry: 'Lọc theo ngành',
  filterByAgency: 'Lọc theo agency',

  // Stats
  activeBrands: 'Thương Hiệu Hoạt Động',
  totalBrands: 'Tổng Thương Hiệu',
  totalCampaigns: 'Tổng Chiến Dịch',
  totalBudget: 'Tổng Ngân Sách',
  totalImpressions: 'Tổng Lượt Hiển Thị',
  allTime: 'tất cả thời gian',
  averageCtr: 'CTR Trung Bình',
  acrossAllBrands: 'trên tất cả thương hiệu',
  active: 'Hoạt Động',
  campaignCount: 'Chiến Dịch',
  activeCampaigns: 'Chiến Dịch Hoạt Động',

  // Empty state
  noBrandsFound: 'Không tìm thấy thương hiệu nào',
  getStartedByCreating: 'Bắt đầu bằng cách tạo thương hiệu đầu tiên',

  // Dialogs
  deleteConfirmation:
    "Bạn có chắc chắn muốn xóa thương hiệu '{name}'? Hành động này không thể hoàn tác.",

  // Messages
  brandCreated: 'Tạo thương hiệu thành công',
  brandUpdated: 'Cập nhật thương hiệu thành công',
  brandDeleted: 'Xóa thương hiệu thành công',
} as const;

export default brands;
