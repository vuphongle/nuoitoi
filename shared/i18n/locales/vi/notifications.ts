const notifications = {
  title: 'Thông báo',
  subtitle: 'Cập nhật những hoạt động và cảnh báo mới nhất.',
  markAllRead: 'Đánh dấu tất cả đã đọc',
  eyebrow: 'Hộp thư',
  completion: 'Hoàn thành',
  cards: {
    all: 'Tất cả',
    allDesc: 'Tổng số thông báo',
    unread: 'Chưa đọc',
    unreadDesc: 'Đang chờ đọc',
    read: 'Đã đọc',
    readDesc: 'Đã xem',
  },
  tabs: {
    all: 'Tất cả',
    unread: 'Chưa đọc',
  },
  empty: {
    title: 'Đã xong tất cả!',
    description: 'Bạn không có thông báo chưa đọc nào.',
  },
  new: 'Mới',
  actions: {
    markRead: 'Đánh dấu đã đọc',
    delete: 'Xóa',
  },
} as const;

export default notifications;
