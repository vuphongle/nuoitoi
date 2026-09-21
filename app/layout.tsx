import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import '@fontsource-variable/fredoka';
import '@fontsource-variable/nunito-sans';
import { Providers } from './providers';
import { SITE_URL } from '@/constants/app';
import './globals.css';
import '@/components/lixi/lixi-design.css';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

const TITLE = 'NuoiToi - Digital Products With Creative Gravity';
const DESCRIPTION =
  'A premium product studio website for AI translation, commerce cards, APIs, support, and growth systems.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | NuoiToi',
  },
  description: DESCRIPTION,
  keywords: [
    'Card Platform',
    'digital product studio',
    'AI translation platform',
    'product design',
    'API platform',
    'SaaS website',
  ],
  authors: [{ name: 'NuoiToi' }],
  creator: 'NuoiToi',
  publisher: 'NuoiToi',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'NuoiToi',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved === 'dark' || ((!saved || saved === 'system') && prefersDark);
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (isDark) {
                    root.classList.add('dark');
                  } else {
                    root.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={
          plusJakarta.variable +
          ' ' +
          spaceGrotesk.variable +
          ' min-h-screen bg-background font-sans antialiased'
        }
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
