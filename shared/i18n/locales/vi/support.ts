const support = {
  hero: {
    badge: 'Trung tâm trợ giúp',
    titlePrefix: 'Hỗ trợ',
    titleHighlight: 'Nền tảng',
    description:
      'Tài liệu kỹ thuật, tài liệu tham khảo API và các kênh kết nối trực tiếp với đội ngũ phát triển.',
  },
  resources: {
    guides: {
      title: 'Hướng dẫn sử dụng',
      text: 'Các bài hướng dẫn từng bước để tích hợp luồng dịch thuật và phát hành thẻ chiến dịch.',
      action: 'Xem hướng dẫn',
    },
    apiReference: {
      title: 'Tài liệu API',
      text: 'Đầy đủ kiểu dữ liệu endpoint, cấu trúc webhook, SDKs và bảng mã lỗi chi tiết.',
      action: 'Khám phá API',
    },
    liveSupport: {
      title: 'Hỗ trợ trực tiếp',
      text: 'Kênh ưu tiên kết nối đội ngũ kỹ thuật cho các hệ thống trong giai đoạn phát hành.',
      action: 'Bắt đầu chat',
    },
  },
  faq: {
    eyebrow: 'Hỏi & Đáp',
    title: 'Câu hỏi thường gặp',
    items: [
      {
        question: 'Làm thế nào để tạo khoá API?',
        answer:
          'Vào bảng điều khiển của bạn, chọn mục Lập trình viên và bấm Tạo khoá bí mật. Hãy lưu trữ cẩn thận vì khoá chỉ hiển thị một lần duy nhất.',
      },
      {
        question: 'Giới hạn lượt gọi (Rate Limit) là bao nhiêu?',
        answer:
          'Tài khoản tiêu chuẩn hỗ trợ 1.000 yêu cầu mỗi phút. Gói Doanh nghiệp có hạ tầng riêng và cam kết SLA theo yêu cầu.',
      },
      {
        question: 'Commerce Cards kết nối như thế nào?',
        answer:
          'Thẻ được cấp qua REST API, liên kết vào hồ sơ khách hàng và có thể kết nối mượt mà với Apple Wallet hoặc Google Pay.',
      },
      {
        question: 'Nền tảng có đảm bảo tính tiếp cận (Accessibility) không?',
        answer:
          'Có. Hệ thống thiết kế dùng mã ngữ nghĩa, viền nét rõ khi focus, nhãn ARIA và tuỳ chọn giảm chuyển động (reduced-motion).',
      },
    ],
  },
} as const;

export default support;
