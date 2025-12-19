import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LoadingProvider } from './components/LoadingProvider';
import { ConvexClientProvider } from './components/ConvexClientProvider';

const googleSans = localFont({
  src: '../assets/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf',
  variable: '--font-google-sans',
  display: 'swap',
});

const monas = localFont({
  src: '../assets/MonasDemoRegular-eZl86.ttf',
  variable: '--font-monas',
  display: 'swap',
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${googleSans.variable} ${monas.variable} antialiased`}
        suppressHydrationWarning
      >
        <ConvexClientProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
