const contact = {
  hero: {
    badge: 'Kết nối',
    titlePrefix: 'Bắt đầu một',
    titleHighlight: 'Dự án',
  },
  form: {
    title: 'Gửi tín hiệu',
    nameLabel: 'Họ và tên',
    namePlaceholder: 'Nguyễn Văn A',
    emailLabel: 'Email',
    emailPlaceholder: 'name@company.com',
    messageLabel: 'Nội dung',
    messagePlaceholder: 'Hãy chia sẻ với chúng tôi về mục tiêu của bạn.',
    submit: 'Gửi yêu cầu',
    submitting: 'Đang gửi...',
    successTitle: 'Thành công',
    successMessage: 'Gửi thông tin liên hệ thành công. Chúng tôi sẽ phản hồi trong 24h.',
    success: 'Gửi thông tin liên hệ thành công. Chúng tôi sẽ phản hồi trong 24h.',
    errorTitle: 'Có lỗi xảy ra',
    errorMessage: 'Có lỗi xảy ra khi gửi thông tin liên hệ. Vui lòng thử lại sau.',
    error: 'Có lỗi xảy ra khi gửi thông tin liên hệ. Vui lòng thử lại sau.',
  },


  offices: {
    globalHq: 'Trụ sở chính',
    globalAddress: 'Quận Bình Thạnh, TP. Hồ Chí Minh, Việt Nam',
    mapPlaceholder: 'Khu vực bản đồ',
    singapore: 'Singapore',
    singaporeAddress: 'Marina Bay',
    singaporeNote: 'Đối tác khu vực Châu Á - Thái Bình Dương',
    amsterdam: 'Amsterdam',
    amsterdamAddress: 'Canal District',
    amsterdamNote: 'Studio sản phẩm khu vực Châu Âu',
  },
  inquiries: {
    title: 'Thông tin liên hệ',
    sales: 'Kinh doanh',
    help: 'Hỗ trợ',
  },
  status: {
    new: 'Mới',
    in_review: 'Đang xử lý',
    replied: 'Đã phản hồi',
    spam: 'Thư rác (Spam)',
  },
} as const;

export default contact;
