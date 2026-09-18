const analytics = {
  title: 'Phân tích & Thống kê',
  subtitle: 'Theo dõi hiệu suất website và mức độ tương tác của người dùng.',
  stats: {
    totalViews: 'Tổng lượt xem',
    uniqueVisitors: 'Người dùng duy nhất',
    avgSession: 'Thời gian phiên trung bình',
    bounceRate: 'Tỷ lệ thoát',
    fromLastMonth: 'so với tháng trước',
  },
  tabs: {
    overview: 'Tổng quan',
    topPages: 'Trang hàng đầu',
    trafficSources: 'Nguồn lưu lượng',
  },
  weeklyTrends: 'Xu hướng hàng tuần',
  weeklyTrendsDesc: 'Lượt xem và khách truy cập trong tuần qua',
  trafficSourcesTitle: 'Nguồn truy cập',
  trafficSourcesDesc: 'Nơi khách truy cập của bạn đến từ',
  topPagesTitle: 'Trang được xem nhiều nhất',
  topPagesDesc: 'Các trang được truy cập nhiều nhất trên website',
  trafficBreakdown: 'Phân tích lưu lượng',
  trafficBreakdownDesc: 'Chi tiết về các nguồn lưu lượng truy cập',
  visitors: 'khách truy cập',
  bounce: 'thoát',
  days: {
    Mon: 'Thứ 2',
    Tue: 'Thứ 3',
    Wed: 'Thứ 4',
    Thu: 'Thứ 5',
    Fri: 'Thứ 6',
    Sat: 'Thứ 7',
    Sun: 'Chủ nhật',
  },
  sources: {
    Direct: 'Trực tiếp',
    Search: 'Tìm kiếm',
    Social: 'Mạng xã hội',
    Referral: 'Giới thiệu',
  },
} as const;

export default analytics;
