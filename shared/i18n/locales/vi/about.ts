const about = {
  hero: {
    badge: 'Công ty',
    titlePrefix: 'Xây dựng để tạo nên',
    titleHighlight: 'sức sống',
    description:
      'Chúng tôi là studio thiết kế và kỹ thuật sản phẩm, kết hợp nội dung, thương mại và dịch thuật AI thành những trải nghiệm số liền mạch.',
  },
  missionVision: {
    eyebrow: 'Sứ mệnh / Tầm nhìn',
    title: 'Làm cho hệ thống trở nên đáng nhớ',
    visionTitle: 'Tầm nhìn',
    visionDesc:
      'Hạ tầng kỹ thuật số cần mang năng lượng thương hiệu, không ẩn sau những giao diện bảng điều khiển đơn điệu.',
    missionTitle: 'Sứ mệnh',
    missionDesc:
      'Xây dựng các tầng sản phẩm dễ tiếp cận, bền vững, giúp mọi chiến dịch, luồng công việc và tích hợp API luôn trọn vẹn giá trị.',
  },
  timeline: {
    eyebrow: 'Hành trình',
    title: 'Từ trợ lý đến hệ sinh thái',
    items: [
      {
        year: '2022',
        title: 'Mẫu thử nghiệm',
        description:
          'Bắt đầu từ trợ lý dịch thuật nhỏ cùng câu hỏi: điều gì xảy ra nếu danh thiếp và thẻ chiến dịch có thể lập trình?',
      },
      {
        year: '2023',
        title: 'Hợp nhất nền tảng',
        description:
          'Đồng bộ dịch thuật, thẻ chiến dịch và tự động hoá quy trình vào một lớp vận hành sản phẩm duy nhất.',
      },
      {
        year: '2024',
        title: 'Mở rộng quy mô',
        description:
          'Mở rộng hạ tầng ưu tiên API cho các đội ngũ triển khai hệ thống tăng trưởng đa ngôn ngữ.',
      },
      {
        year: '2026',
        title: 'Studio toàn diện',
        description:
          'Ra mắt ngôn ngữ thiết kế mới: phong cách tương phản cao đi cùng nền tảng sản phẩm đạt chuẩn vận hành.',
      },
    ],
  },
  team: {
    eyebrow: 'Đội ngũ',
    title: 'Đội ngũ chuyên môn cao',
    roles: ['Kiến trúc sư Design System', 'Kỹ sư Frontend', 'Chuyên gia chiến lược nền tảng'],
  },
  values: {
    eyebrow: 'Giá trị cốt lõi',
    title: 'Nguyên tắc vận hành',
    items: [
      {
        title: 'Tốc độ',
        description: 'Chúng tôi triển khai nhanh nhưng luôn đảm bảo giao diện bền vững, không chắp vá.',
      },
      {
        title: 'Tin cậy',
        description:
          'Bảo mật, khả năng tiếp cận và nền tảng ổn định là một phần không thể thiếu của thương hiệu.',
      },
      {
        title: 'Đồng hành',
        description: 'Chiến lược sản phẩm, tay nghề thiết kế và quyết định kỹ thuật luôn gắn kết chặt chẽ.',
      },
    ],
  },
  techStack: {
    eyebrow: 'Công nghệ',
    title: 'Tối ưu cho tốc độ và mở rộng',
    items: [
      { title: 'Next.js', description: 'Kiến trúc App Router hiện đại' },
      { title: 'Tailwind CSS', description: 'Hệ thống biến giao diện ngữ nghĩa' },
      { title: 'Framer Motion', description: 'Hiệu ứng chuyển động mượt mà' },
    ],
  },
} as const;

export default about;
