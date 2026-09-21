import type { Metadata } from 'next';
import { LixiPage } from '@/components/lixi/LixiPage';
import { SITE_URL } from '@/constants/app';

const TITLE = 'Lì Xì Thật Thà - Dashboard Tết minh bạch & vui nhộn';
const DESCRIPTION =
  'Landing page lì xì chuyển khoản phong cách dashboard minh bạch: số liệu rõ ràng, vibe Tết vui nhộn, meme nhẹ nhàng.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description:
      'Trang parody Tết: lì xì chuyển khoản với bảng số minh bạch, QR rõ ràng, hóa đơn đầy đủ.',
  },
};

export default function HomePage() {
  return <LixiPage />;
}
