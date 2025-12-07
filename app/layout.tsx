import type { Metadata } from 'next';
import { Inter_Tight, Pattaya } from 'next/font/google';
import './globals.css';
import { LoadingProvider } from './components/LoadingProvider';
import { ConvexClientProvider } from './components/ConvexClientProvider';

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const pattahya = Pattaya({
  variable: '--font-pattaya',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'LunaticLadz',
  description: 'LunaticLadz - Official Gaming Community',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${pattahya.variable} antialiased`}
      >
        <ConvexClientProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
