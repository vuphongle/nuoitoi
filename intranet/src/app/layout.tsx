import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Nhà Mình — Không gian nội bộ',
    template: '%s · Nhà Mình',
  },
  description: 'Không gian nội bộ để đồng nghiệp hiểu nhau hơn, kết nối dễ hơn và đi làm vui hơn.',
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fff8f3',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
