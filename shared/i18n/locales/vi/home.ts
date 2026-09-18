const home = {
  hero: {
    eyebrow: 'Studio sản phẩm thế hệ mới',
    titlePrefix: 'Sản phẩm',
    titleHighlight: 'Kỹ thuật số',
    titleSuffix: 'với sức hút nguyên bản',
    description:
      'Năng lượng sáng tạo đột phá, kiến trúc sản phẩm chuẩn mực và hệ thống số tối ưu chuyển đổi.',
    explore: 'Khám phá nền tảng',
    contact: 'Liên hệ ngay',
  },
  marquee: {
    items: ['Sản phẩm số', 'Agency sáng tạo', 'Nền tảng SaaS', 'Design System'],
  },
  about: {
    eyebrow: 'Về chúng tôi',
    title: 'Bùng nổ bên ngoài. Chuẩn xác bên trong.',
    description:
      'Card Platform biến định vị sáng tạo táo bạo thành hệ thống sản phẩm bền vững: API, cổng thông tin khách hàng, giao diện phân tích và nền tảng thiết kế tái sử dụng.',
    cardBadge: 'Tổng hợp nguyên bản',
    cardTitle: 'Năng lượng agency, kỷ luật nền tảng.',
    stats: {
      stat1: { value: '99%', label: 'Điểm Lighthouse', text: 'Tối ưu tốc độ tải' },
      stat2: { value: '0px', label: 'Dịch chuyển bố cục', text: 'Bento grid ổn định' },
      stat3: { value: '16ms', label: 'Khung hình mượt', text: 'Hệ thống chuyển động tối ưu' },
    },
  },
  featuredProducts: {
    eyebrow: 'Sản phẩm nổi bật',
    title: 'Các module nền tảng mạnh mẽ',
    items: {
      aiTranslate: {
        title: 'AI Translate',
        category: 'AI',
        description:
          'Dịch thuật đa ngôn ngữ thời gian thực cho sản phẩm, trung tâm hỗ trợ và quy trình tài liệu phức tạp.',
        metrics: '120+ Ngôn ngữ',
      },
      commerceCards: {
        title: 'Commerce Cards',
        category: 'Thẻ số',
        description:
          'Thẻ chiến dịch và khách hàng thân thiết có thể lập trình, sẵn sàng cho ví điện tử và token thương hiệu.',
        metrics: 'Kích hoạt 4.8x',
      },
      documentFlow: {
        title: 'Document Flow',
        category: 'Tự động hoá',
        description:
          'Phân loại, dịch thuật, phê duyệt và điều phối tài liệu doanh nghiệp bảo mật giữa các phòng ban.',
        metrics: 'Nhanh hơn 72%',
      },
    },
  },
  services: {
    eyebrow: 'Dịch vụ',
    title: 'Các khối hệ thống tái sử dụng',
    items: {
      bentoGrids: {
        title: 'Bento Grids',
        description: 'Kiến trúc CSS Grid chính xác cho cấu trúc nội dung rõ ràng và mạch lạc.',
      },
      kineticMotion: {
        title: 'Chuyển động mượt mà',
        description: 'Hiệu ứng cuộn trang và hoạt ảnh vật lý tối ưu bằng Framer Motion.',
      },
      glassSurfaces: {
        title: 'Giao diện chiều sâu',
        description: 'Lớp mờ kính, hiệu ứng phát sáng nhẹ tối ưu cho giao diện Dark Mode.',
      },
      serverBoundaries: {
        title: 'Tối ưu Server & Client',
        description: 'Phân tách ranh giới rõ ràng trong App Router giúp trang tải nhanh và mượt mà.',
      },
    },
  },
  clients: {
    eyebrow: 'Khách hàng',
    title: 'Được tin dùng bởi các đội ngũ phát triển nhanh',
  },
  testimonials: {
    eyebrow: 'Đánh giá',
    title: 'Phản hồi từ các nhà phát triển',
    items: [
      {
        quote:
          'Ngôn ngữ thiết kế cực kỳ ấn tượng. Nó mang năng lượng sáng tạo của agency vào một hệ thống SaaS hoàn chỉnh.',
        name: 'Sarah Jenkins',
        role: 'Product Designer',
      },
      {
        quote:
          'Một giao diện thực sự khác biệt, không bị rập khuôn. Chuyển động và trải nghiệm tương tác rất mượt mà.',
        name: 'Marcus Chen',
        role: 'Frontend Lead',
      },
    ],
  },
} as const;

export default home;
