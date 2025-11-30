import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OMOYEL - サロン見学予約',
  description: 'あなたの理想のサロンを見つけましょう',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* Google Maps API を全ページで一度だけ読み込む */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=ja&libraries=geometry`}
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}

