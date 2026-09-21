const products = {
  hero: {
    badge: 'Năng lực',
    titlePrefix: 'Sản phẩm',
    titleHighlight: 'Nền tảng',
    description:
      'Từ các khối API chuyên sâu cho doanh nghiệp đến module tạo chiến dịch không cần code. Kiến trúc xây dựng để mở rộng quy mô.',
  },
  searchPlaceholder: 'Tìm kiếm sản phẩm trên nền tảng...',
  categories: {
    all: 'Tất cả',
    ai: 'AI',
    cards: 'Thẻ số',
    automation: 'Tự động hoá',
    developer: 'Lập trình viên',
    security: 'Bảo mật',
  },
  empty: {
    title: 'Không tìm thấy sản phẩm',
    description: 'Vui lòng thử tìm kiếm với từ khóa hoặc danh mục khác.',
  },
  dialog: {
    featured: 'Nổi bật',
    keyMetric: 'Chỉ số nổi bật',
    close: 'Đóng',
  },
  items: {
    aiTranslate: {
      title: 'AI Translate',
      category: 'AI',
      description:
        'Dịch văn bản, giọng nói và tài liệu thời gian thực với các tùy chọn bảo mật doanh nghiệp.',
      metrics: '120+ Ngôn ngữ',
    },
    commerceCards: {
      title: 'Commerce Cards',
      category: 'Thẻ số',
      description: 'Thẻ chiến dịch, thẻ thành viên có thể lập trình và nhúng vào ví điện tử.',
      metrics: 'Kích hoạt 4.8x',
    },
    documentFlow: {
      title: 'Document Flow',
      category: 'Tự động hoá',
      description: 'Tải lên, phân loại, dịch và điều phối luồng tài liệu doanh nghiệp bảo mật.',
      metrics: 'Nhanh hơn 72%',
    },
    apiCore: {
      title: 'API Core',
      category: 'Lập trình viên',
      description:
        'Hệ thống API hoàn chỉnh cho dịch thuật, phát hành thẻ, định danh và sự kiện phân tích.',
      metrics: '99.99% Uptime',
    },
    riskShield: {
      title: 'Risk Shield',
      category: 'Bảo mật',
      description:
        'Kiểm tra chính sách, nhật ký kiểm toán và phòng chống gian lận cho hệ thống lớn.',
      metrics: 'Chuẩn SOC2',
    },
    insightEngine: {
      title: 'Insight Engine',
      category: 'AI',
      description: 'Phân khúc hành vi người dùng, gợi ý nội dung và tối ưu hiệu quả chiến dịch.',
      metrics: 'Tăng trưởng 38%',
    },
    creativeStudio: {
      title: 'Creative Studio',
      category: 'Thẻ số',
      description:
        'Tạo thẻ nhanh không cần code với bộ quy tắc thiết kế thương hiệu và mẫu chuyển đổi.',
      metrics: 'Triển khai vài phút',
    },
  },
  status: {
    active: 'Đang hoạt động',
    draft: 'Bản nháp',
    archived: 'Lưu trữ',
  },
  admin: {
    list: {
      eyebrow: 'Danh mục nội dung',
      title: 'Quản lý sản phẩm',
      description: 'Quản lý sản phẩm, bản dịch, danh mục, trạng thái và thứ tự hiển thị.',
      addProduct: 'Thêm sản phẩm',
      commandSearchPlaceholder: 'Tìm sản phẩm theo tiêu đề hoặc slug',
      toolbarSearchPlaceholder: 'Tìm theo tiêu đề, slug...',
      searchAriaLabel: 'Tìm kiếm sản phẩm',
      filterCategoryAriaLabel: 'Lọc theo danh mục',
      filterStatusAriaLabel: 'Lọc theo trạng thái',
      filterFeaturedAriaLabel: 'Lọc sản phẩm nổi bật',
      allCategories: 'Tất cả danh mục',
      allStatuses: 'Tất cả trạng thái',
      statusPlaceholder: 'Trạng thái',
      featuredPlaceholder: 'Độ nổi bật',
      allFeatured: 'Tất cả sản phẩm',
      featuredOnly: 'Nổi bật',
      normal: 'Thông thường',
      metrics: {
        total: 'Tổng sản phẩm',
        totalTrend: 'Theo dữ liệu hiện có',
        active: 'Đang hoạt động',
        drafts: 'Bản nháp',
        categories: 'Danh mục',
        categoriesTrend: 'Danh mục hiện có',
        pageTrend: 'Trên trang này',
      },
      table: {
        product: 'Sản phẩm',
        category: 'Danh mục',
        metrics: 'Chỉ số',
        order: 'Thứ tự',
        status: 'Trạng thái',
        updatedAt: 'Cập nhật',
        actions: 'Thao tác',
        featured: 'Nổi bật',
      },
      status: {
        active: 'Hoạt động',
        draft: 'Bản nháp',
        archived: 'Lưu trữ',
      },
      rowActionsTrigger: 'Mở thao tác cho {{slug}}',
      deleteLabel: 'Xóa sản phẩm',
      pageOf: 'Trang {{page}} / {{totalPages}}',
      listTitle: 'Danh sách sản phẩm',
      listDescription: 'Hiển thị {{shown}} trên tổng số {{total}} sản phẩm',
      listDescriptionFallback: 'Dữ liệu sản phẩm hiện có',
      loadError: 'Không thể tải danh sách sản phẩm.',
      emptyFilteredTitle: 'Không tìm thấy sản phẩm phù hợp',
      emptyTitle: 'Chưa có sản phẩm',
      emptyFilteredDescription: 'Hãy điều chỉnh hoặc xóa bộ lọc để xem thêm kết quả.',
      emptyDescription: 'Tạo sản phẩm đầu tiên để bắt đầu quản lý nội dung.',
      deleteConfirmTitle: 'Xóa sản phẩm',
      deleteConfirmDescription:
        'Bạn có chắc chắn muốn xóa sản phẩm "{{title}}"? Hành động này không thể hoàn tác.',
      deleteConfirmButton: 'Xóa sản phẩm',
      deleteSuccess: 'Đã xóa sản phẩm thành công!',
      deleteError: 'Có lỗi xảy ra khi xóa sản phẩm',
    },
    categoryPage: {
      title: 'Danh mục sản phẩm',
      description: 'Quản lý các danh mục phân loại giải pháp và sản phẩm nền tảng.',
      emptyTitle: 'Chưa có danh mục sản phẩm',
      deleteTitle: 'Xóa danh mục sản phẩm',
      deleteDescription:
        'Bạn có chắc chắn muốn xóa danh mục "{{name}}"? Hành động này không thể hoàn tác.',
      deleteSuccess: 'Đã xóa danh mục sản phẩm thành công!',
      deleteError: 'Có lỗi xảy ra khi xóa danh mục sản phẩm',
    },
  },
} as const;

export default products;
