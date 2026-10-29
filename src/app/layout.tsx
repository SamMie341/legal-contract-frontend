import type { Metadata } from 'next';
import { Fira_Code, Noto_Sans_Lao } from 'next/font/google';
import { AppProviders } from '@/presentation/providers';
import './globals.css';

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  display: 'swap',
});

const notoSansLao = Noto_Sans_Lao({
  variable: '--font-noto-sans-lao',
  subsets: ['lao'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ລະບົບຄຸ້ມຄອງສັນຍາ, ນິຕິກຳ ແລະ ຄະດີຄວາມ | EDL Legal System',
    template: '%s | EDL Legal & Contract System',
  },
  description: 'ລະບົບຄຸ້ມຄອງສັນຍາ, ນິຕິກຳ ແລະ ຄະດີຄວາມ ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/edl-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/edl-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="lo"
      className={`${firaCode.variable} ${notoSansLao.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background-base text-text-primary"
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
