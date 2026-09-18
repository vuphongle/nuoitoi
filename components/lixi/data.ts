export interface LixiSession {
  id: string;
  name: string;
  tagline: string;
  bank: string;
  account: string;
  owner: string;
  content: string;
  qr: string;
  avatar: string;
}

export const sessionData: LixiSession[] = [
  {
    id: 'lx02',
    name: 'Hương Nếp',
    tagline: 'Trực mứt gừng, thích số tròn',
    bank: 'ACB',
    account: '9988776655',
    owner: 'Hương Nếp',
    content: 'Lì xì Hương Nếp - [Tên của bạn]',
    qr: '/lixi/qr/huong.jpg',
    avatar: '/lixi/user/huong.jpg',
  },
  {
    id: 'lx03',
    name: 'Minh Hiếu',
    tagline: 'Ca tối: lau nhà, lau luôn sao kê',
    bank: 'MB Bank',
    account: '888999000',
    owner: 'Minh Hiếu',
    content: 'Lì xì Minh Hiếu - [Tên của bạn]',
    qr: '/lixi/qr/hieu2.jpg',
    avatar: '/lixi/user/hieu.jpg',
  },
  {
    id: 'lx04',
    name: 'Hải Yến',
    tagline: 'Check bill trước khi mở bao',
    bank: 'VPBank',
    account: '5566778899',
    owner: 'Hải Yến',
    content: 'Lì xì Hải Yến - [Tên của bạn]',
    qr: '/lixi/qr/yen.jpg',
    avatar: '/lixi/user/yen.jpg',
  },
  {
    id: 'lx05',
    name: 'Anh Phú',
    tagline: 'Lì xì đổi lại lời chúc thơm',
    bank: 'Sacombank',
    account: '3344556677',
    owner: 'Anh Phú',
    content: 'Lì xì Anh Phú - [Tên của bạn]',
    qr: '/lixi/qr/phu.jpg',
    avatar: '/lixi/user/phu.jpg',
  },
  {
    id: 'lx06',
    name: 'A Tứn',
    tagline: 'Tư vấn phong thủy số tài khoản',
    bank: 'BIDV',
    account: '6677889900',
    owner: 'Tứn Mai',
    content: 'Lì xì Tứn Mai - [Tên của bạn]',
    qr: '/lixi/qr/khay.jpg',
    avatar: '/lixi/user/khay.jpg',
  },
  {
    id: 'lx07',
    name: 'Hiếu Bến Tàu',
    tagline: 'Ca đêm: đếm tiền lì xì thay bạn',
    bank: 'TPBank',
    account: '111222333',
    owner: 'Hiếu Bến Tàu',
    content: 'Lì xì Hiếu Bến Tàu - [Tên của bạn]',
    qr: '/lixi/qr/hieu.jpg',
    avatar: '/lixi/user/hieuava.jpg',
  },
  {
    id: 'lx08',
    name: 'Đôn Chủng',
    tagline: 'Chủ nhiệm câu lạc bộ hành phi',
    bank: 'VietinBank',
    account: '909090123',
    owner: 'Đôn Chủng',
    content: 'Lì xì Đôn Chủng - [Tên của bạn]',
    qr: '/lixi/qr/chung.jpg',
    avatar: '/lixi/user/chung.jpg',
  },
  {
    id: 'lx09',
    name: 'wem.hai',
    tagline: 'Chủ nhiệm câu lạc bộ hành hạ',
    bank: 'VietinBank',
    account: '909090123',
    owner: 'Hái Chỉ',
    content: 'Lì xì Đôn Chủng - [Tên của bạn]',
    qr: '/lixi/qr/hai.jpg',
    avatar: '/lixi/user/hai.jpg',
  },
  {
    id: 'lx10',
    name: 'A Pha',
    tagline: 'Cầm đầu mấy thằng em quận 12',
    bank: 'VietinBank',
    account: '909090123',
    owner: 'Hái Chỉ',
    content: 'Lì xì Cho T - [Tên của bạn]',
    qr: '/lixi/qr/hieu.jpg',
    avatar: '/lixi/user/apha.jpg',
  },
  {
    id: 'lx11',
    name: 'A kHanG',
    tagline: 'Chủ nhiệm câu lạc bộ hành hạ',
    bank: 'VietinBank',
    account: '909090123',
    owner: 'Hái Chỉ',
    content: 'Lì xì Đôn Chủng - [Tên của bạn]',
    qr: '/lixi/qr/hai.jpg',
    avatar: '/lixi/user/user04.jpg',
  },
  {
    id: 'lx01',
    name: 'Phong Lá',
    tagline: 'Chuyên viên gói lá dong full option',
    bank: 'Techcombank',
    account: '2233445566',
    owner: 'Phong Lá',
    content: 'Lì xì Phong Lá - [Tên của bạn]',
    qr: '/lixi/qr/hieu.jpg',
    avatar: '/lixi/user/phong.jpg',
  },
];

export interface LixiExpense {
  title: string;
  date: string;
  amount: string;
  note: string;
  description: string;
  lines: string[];
}

export const expenseData: LixiExpense[] = [
  {
    title: 'Bánh chưng lá dong xịn',
    date: 'Ngày 28/12 ÂL',
    amount: '-320.000 đ',
    note: 'Mua combo 2 bánh chưng để canh nồi xuyên đêm.',
    description: 'Đặt bánh chưng lá dong ruột xanh, có hóa đơn đỏ (đùa).',
    lines: [
      '2 bánh chưng loại 1kg: 280.000 đ',
      'Dây lạt + gia vị thêm: 20.000 đ',
      'Ship hỏa tốc trước 30 Tết: 20.000 đ',
    ],
  },
  {
    title: 'Hoa mai mini',
    date: 'Ngày 26/12 ÂL',
    amount: '-180.000 đ',
    note: 'Hoa mai bé nhưng rực rỡ, đặt ngay góc sao kê.',
    description: 'Mua chậu hoa mai mini để livestream đẹp hơn.',
    lines: ['Chậu hoa mai: 150.000 đ', 'Nơ đỏ + dây đèn fairy: 30.000 đ'],
  },
  {
    title: 'Bao lì xì in QR',
    date: 'Ngày 25/12 ÂL',
    amount: '-95.000 đ',
    note: 'Bao lì xì tự thiết kế, có QR để quét ngược lại.',
    description: 'In bao lì xì meme, tặng kèm QR để mọi người thử quét.',
    lines: ['In 30 bao lì xì: 75.000 đ', 'Dây ruy băng: 10.000 đ', 'Phí thiết kế (tự làm): 0 đ'],
  },
  {
    title: 'Cà phê canh nồi',
    date: 'Ngày 24/12 ÂL',
    amount: '-42.000 đ',
    note: 'Ly cà phê đen đá để thức xem chuyển khoản lúc nửa đêm.',
    description: 'Cafe take-away, hóa đơn rõ ràng, không làm tròn.',
    lines: ['Cà phê đen đá: 32.000 đ', 'Gửi xe và tiền đá thêm: 10.000 đ'],
  },
  {
    title: 'Vé xe về quê',
    date: 'Ngày 23/12 ÂL',
    amount: '-420.000 đ',
    note: 'Đặt vé sớm để khỏi tăng giá, về quê khoe bảng sao kê.',
    description: 'Vé khứ hồi, ghế có ổ cắm sạc để livestream hành trình.',
    lines: [
      'Vé lượt đi: 210.000 đ',
      'Vé lượt về: 210.000 đ',
      'Nước suối mang theo: 0 đ (được tặng)',
    ],
  },
];

export const navLinks = [
  { href: '#hero', label: 'Trang chủ' },
  { href: '#dashboard', label: 'Bảng số' },
  { href: '#expenses', label: 'Chi tiêu' },
  { href: '#why', label: 'Vì sao?' },
  { href: '#commit', label: 'Cam kết' },
  { href: '#compare', label: 'So sánh' },
  { href: '#donate', label: 'Lì xì ngay' },
];

export const kpiData = [
  {
    label: 'Tổng đã nhận',
    target: 18600000,
    format: 'currency' as const,
    note: 'Đủ mua 1 set mứt full topping',
  },
  {
    label: 'Số lượt lì xì',
    target: 142,
    suffix: ' lượt',
    note: 'Mỗi lượt đều được cảm ơn bằng meme',
  },
  {
    label: 'Thu hôm nay',
    target: 720000,
    format: 'currency' as const,
    note: 'Nhanh hơn tốc độ bánh chưng chín',
    tone: 'positive' as const,
  },
  {
    label: 'Chi hôm nay',
    target: 410000,
    format: 'currency' as const,
    note: 'Có bill, có ảnh, không che',
    tone: 'negative' as const,
  },
  {
    label: 'Còn lại',
    target: 11200000,
    format: 'currency' as const,
    note: 'Đang khóa két chờ sắm áo mới',
  },
];

export const featureData = [
  {
    icon: 'statement',
    title: 'Sao kê realtime',
    text: 'Cập nhật liên tục, ping mỗi lần có tiền vào.',
  },
  {
    icon: 'transparency',
    title: 'Minh bạch 200-300%',
    text: 'Ảnh bill rõ nét, zoom thấy từng hạt mứt trong góc.',
  },
  {
    icon: 'spending',
    title: 'Chi tiêu hợp lý',
    text: 'Ưu tiên bánh chưng, hoa, vé xe. Không mua siêu xe.',
  },
  {
    icon: 'tracking',
    title: 'Theo dõi 24/7',
    text: 'Bảng điều khiển hiển thị mọi khoản; không có góc khuất.',
  },
] as const;

export const commitData = [
  { title: 'Sao kê đúng giờ:', text: '06:30 & 21:00, kể cả mùng 1.' },
  { title: 'Không bỏ qua khoản nhỏ:', text: 'Bao lì xì 5k cũng lên bảng.' },
  { title: 'Có chứng từ minh họa:', text: 'Ảnh bill, QR, emoji minh họa.' },
  { title: 'Unboxing vui:', text: 'Mua gì quay clip mở hộp, chèn nhạc remix.' },
  { title: 'Phản hồi nhanh:', text: 'Chỉ chậm nếu đang rửa lá dong.' },
  { title: 'Không block người hỏi:', text: 'Trừ bot spam lì xì 1đ.' },
  { title: 'Không có khoản "mất tích sau giao thừa":', text: 'Mọi đồng đều được gắn tag.' },
];

export const compareBad = [
  'Bill mờ như sương sớm mùng 1.',
  '"Đang tổng hợp, chờ dịp khác đăng".',
  'Không thấy QR, chỉ thấy ảnh hoa.',
  'Inbox hỏi thì bặt vô âm tín.',
];

export const compareGood = [
  'Bill rõ tới hạt mứt, zoom không vỡ.',
  'Đăng trước khi tiêu, để bạn duyệt.',
  'QR to, tên rõ, không nhầm chủ tài khoản.',
  'Hỏi gì trả lời nấy, chỉ trễ khi đang gói bánh.',
];

export const allocationData = [
  { label: 'Ăn uống ngày Tết', percent: 32, tone: 'primary' as const },
  { label: 'Quà biếu', percent: 18, tone: 'accent' as const },
  { label: 'Vé xe', percent: 15, tone: 'soft' as const },
  { label: 'Quần áo đi chơi', percent: 14, tone: 'gold' as const },
  { label: 'Bao lì xì', percent: 11, tone: 'danger' as const },
  { label: 'Dự phòng sau Tết', percent: 10, tone: 'muted' as const },
];
